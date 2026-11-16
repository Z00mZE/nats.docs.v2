---
id: auth-callout
title: "Внешняя аутентификация (Auth callout)"
sidebar_position: 8
description: "Внешнее решение аутентификации через $SYS.REQ.USER.AUTH с подписанными запросом и ответом"
---

# Внешняя аутентификация (Auth callout) {#auth-callout}

Ранее сервер решал по списку пользователей либо цепочке ACME. Всё нужное находилось у него.

Если источник личности — OIDC, LDAP или сервис коротких токенов, не нужно копировать каталог в NATS. Сервер может спросить внешний сервис.

## Что такое auth callout {#what-auth-callout-is}

**Auth callout** передаёт решение сервису NATS: сервер упаковывает предъявленные данные и сведения соединения, отправляет и ждёт.

**Auth-сервис** auth-svc применяет свою логику и возвращает личность или отказ.

Обмен request/reply идёт через `$SYS.REQ.USER.AUTH`: сервер публикует, auth-svc подписан.

Протокол фиксирован, проверка внутри сервиса ваша: так подключается любая внешняя система.

ADR-26 определяет поля, подписи и необязательное шифрование.

## Последовательность {#the-flow}

<div class="nats-flow" data-scenario="authCalloutAnimated" data-width="600" data-height="380"></div>

Проследим соединение.

Клиент предъявляет ord-token-123 и не входит в auth_users. Сервер создаёт запрос вместо проверки своего списка.

Auth-svc получает его и связывает токен с order-svc в ORDERS.

Ответ даёт серверу личность, вход разрешён, публикация проходит.

Клиент не видит callout: проверка каталога и отображение выполнены отдельно.

## Конфигурация {#configure-it}

Вернёмся из operator в config mode к authorization из [Основ аутентификации](/learn/security/authentication-basics). Callout возможен в обоих, но JWT-вариант ниже. Минимальный пример создаёт пустые ORDERS и ANALYTICS без прежних пользователей, прав и экспорта, затем auth_callout:

```conf
accounts {
    ORDERS: {}
    ANALYTICS: {}
}

authorization {
    # auth-svc connects with these credentials.
    users: [ { user: auth-svc, password: c4llout } ]

    auth_callout {
        # Public account NKey allowed to sign the response.
        issuer: "ABJHLOVMPA4CI6R5KLNGOB4GSLNIY7IOUPAJC4YFNDLQVIOBYQGUWVLA"
        # Users that bypass the callout (the auth service itself).
        auth_users: [ auth-svc ]
    }
}
```

Целевая запись должна существовать в конфигурации.

В блоке важны поля:

Issuer — открытый account NKey подписи ответа, с префиксом A. `nats auth nkey gen account --output
issuer.nk` создаёт seed, show печатает открытый. Seed хранит auth-svc.

Auth_users обходит callout: самому auth-svc нужен обычный вход для приёма запросов, иначе он никогда не подключится.

Users задаёт обходные данные auth-svc / c4llout.

Account определяет запись сервиса и защищённой темы. Здесь не задан и равен $G; при эксплуатации нужна отдельная.

С запущенным сервисом ord-token-123 отображается в order-svc/ORDERS:

```bash
nats --token "ord-token-123" pub orders.created \
  '{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}'
```

```
14:20:43 Published 91 bytes to "orders.created"
```

Сервер не знает токен, но публикация проходит. Неверный даёт:

```bash
nats --token "wrong-token" pub orders.created 'x'
```

```
nats: error: nats: Authorization Violation
```

Клиент узнаёт только Authorization Violation, причина остаётся в журнале.

Нужен NATS Server 2.10.0+. В FIPS-140 механизм отключён.

## Отдельная запись auth-сервиса {#why-the-auth-service-runs-in-its-own-account}

Каждый запрос несёт предъявленный токен, пароль или NKey. Чтение темы раскрывает данные чужих соединений.

Обходной пользователь может подписаться и декодировать запрос тестового клиента в JSON:

<div class="nats-example" data-type="learn-security-auth-callout-observe-request" data-languages="cli"></div>

```
{
  "aud": "nats-authorization-request",
  "iss": "NAFYFDR6WSIIQ5ABEJQWTZ6MGWSHSSATKRMR3STTBJ52MHJQA5YIHA3R",
  ...
  "nats": {
    ...
    "user_nkey": "UA423HWLLH3GJC662GWLEBBGKTZXIM6TNZIXQKPCDPFIL3II5FNDRDLC",
    "client_info": { ..., "user": "[REDACTED]", ... },
    "connect_opts": { "auth_token": "test-cred-xyz", ... },
    "type": "authorization_request"
  }
}
```

Свежий user_nkey индивидуален, но auth_token читаем: base64 не шифрует. Client_info.user скрыт, исходный секрет нет. От этого защищают изоляция записи и xkey.

На записи callout сервер автоматически запрещает всем публикацию в `$SYS.REQ.USER.AUTH`, включая auth-svc, которому нужны подписка и ответ. Это исключает подделку обычным пользователем.

Запрет не защищает от чтения. ADR-26 рекомендует выделенную запись только для auth-svc, изолированную от арендаторов. Сервис имеет широкие полномочия назначения клиентов и заслуживает отдельной границы.

Задайте account на такую запись.

## Подписанные запрос и ответ {#the-signed-request-and-response}

Подделанный ответ позволил бы выдать любую личность. Защищают подписи и одноразовый ключ.

Запрос — JWT, подписанный созданным при запуске серверным NKey, issuer — ID сервера, audience — nats-authorization-request. Сервис проверяет целостность, но ключ не является заранее доверенной личностью. От поддельных запросов защищает серверный publish deny.

В user_nkey помещён свежий открытый ключ соединения. Ответ должен иметь точно его subject, поэтому старый ответ нельзя воспроизвести для нового входа.

Ответ auth-svc — два вложенных JWT. Внешний вердикт имеет subject user_nkey и audience запрашивающего сервера, не подходит другому.

Внутренний пользовательский JWT также имеет user_nkey, audience — имя ORDERS, определяющее размещение. Оба подписаны issuer из конфигурации. В config mode issuer_account во внутреннем JWT запрещён.

Проверим запись журнала для запрещённой ответными правами публикации:

```
[ERR] 127.0.0.1:57852 - cid:12 - "v1.51.0:go:NATS CLI Version v0.4.0" - "ORDERS/user:order-svc" - Publish Violation - Subject "billing.charge"
```

Хотя клиент принёс только токен, журнал видит order-svc в ORDERS. Личность, запись и права заданы ответом.

Явный отказ возвращает сразу `nats: error: nats: Authorization Violation`, подробный текст только серверу:

```
[WRN] Auth callout service returned an error: token did not match any known service
```

Сервис также может не отвечать: клиент ждёт срок и обычно получает `read tcp ...: i/o
timeout`. Библиотеки рекомендуют это для неверных данных, замедляя перебор.

## Когда применять {#when-to-use-it}

Это более сложный вариант для внешнего источника личности.

- **OIDC/SSO** — проверка bearer-токена провайдера и отображение утверждений.
- **LDAP** — корпоративные пользователи и группы с соответствующими правами.
- **Собственные токены** — API-ключ, подписанный cookie, лицензия.

Статическому списку подходит config, управляемой цепочке — operator. Callout нужен внешнему вердикту.

## За рамками {#what-were-leaving-out}

Дополнительные части ADR-26:

- X25519 **xkey** шифрует запросы и ответы даже от читателя темы; см. [auth_callout](/reference/config/authorization/auth_callout).
- **Allowed_accounts**, сервер 2.11+, ограничивает делегируемые конфигурационные записи. Неизвестные пользователи попадают в $G и всегда проходят callout. Без ограничения все, кроме auth_users, проходят его даже с правильным config-паролем; список даёт постепенный переход.
- В operator mode настройка в JWT записи с перечнем разрешённых целевых записей; детали в ADR-26.
- Обработчик декодирования, проверки и подписи пишется готовыми библиотеками из ссылок ниже.

Здесь используются issuer и auth_users в $G.

## Типичные ошибки {#pitfalls}

Две основные:

**Auth-сервис — точка отказа.** Все новые соединения ждут его. Недоступность или медленная проверка приводит к отказу после стандартных двух секунд authorization timeout.

Настройте срок осознанно, несколько экземпляров и быстрые OIDC/LDAP-запросы.

У клиента connect deadline тоже около двух секунд: при совпадении он чаще видит i/o timeout. Если серверный срок короче, например секунда, первым приходит Authorization Violation. Причина в обоих случаях в журнале.

Проверка без отвечающего сервиса:

<div class="nats-example" data-type="learn-security-auth-callout-callout-timeout" data-languages="cli"></div>

```
nats: error: nats: Authorization Violation
```

Через заданную секунду журнал сообщает `[ERR] ... authentication error - Token "[REDACTED]"`, скрывая сам токен.

**Приложение в auth_users.** Такой пользователь пропускает внешнюю проверку. Список нужен только для входа auth-svc.

Не добавляйте приложения ради экономии обмена: это обход внешней аутентификации.

<div class="nats-example" data-type="learn-security-auth-callout-auth-users-scope" data-languages="cli"></div>

```
14:22:34 Published 1 bytes to "orders.created"
nats: error: read tcp ...: i/o timeout
```

Auth-svc входит и без работающего auth-сервиса, потому что исключён. Токен-клиент не исключён и через две секунды получает отказ.

Ещё два риска: общая $G и отсутствие xkey. Выделите запись и шифруйте секреты, если подписка могла утечь.

## Что уже готово {#where-you-are}

Callout настроен:

- Сервер отправляет попытки в `$SYS.REQ.USER.AUTH`.
- Auth-svc связывает ord-token-123 с order-svc/ORDERS.
- Подписи и одноразовый user_nkey защищают обмен и повтор.
- Демонстрация в $G; при эксплуатации account выделен auth-svc, тема защищена серверными ограничениями.

Освоены три модели: список, цепочка подписей и внешний сервис.

## Что дальше {#whats-next}

Пока TCP открытый: пароли, токены и JWT видимы в сети. Далее TLS, сертификаты и шифрование хранения.

Перейдите к [Шифрованию и TLS](/learn/security/encryption).

## См. также {#see-also}

- [auth_callout](/reference/config/authorization/auth_callout) — xkey, allowed_accounts.
- [Децентрализованная аутентификация](/learn/security/decentralized-auth) — JWT и NKeys.
- [ADR-26](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-26.md) — протокол.
- [callout.go](https://github.com/synadia-io/callout.go), [callout.net](https://github.com/synadia-io/callout.net), [NATS by Example](https://natsbyexample.com/examples/auth/callout/cli) — готовые библиотеки и сервисы.
