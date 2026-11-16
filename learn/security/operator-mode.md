---
id: operator-mode
title: "Режим оператора"
sidebar_position: 6
description: "Цепочка доверия ACME через nats auth, resolver и подключение файлом creds"
---

# Режим оператора {#operator-mode}

В конфигурации уже есть ORDERS, ANALYTICS, права order-svc и обмен orders.shipped. Сервер читает каждого пользователя, пароль и разрешение из файла.

**Режим оператора** заменяет список цепочкой подписей: оператор подписывает записи, те — пользователей. Сервер доверяет оператору и проверяет цепочку при входе. Создадим ACME, прежних арендаторов и пользователей. Следующая страница объяснит доказательства подписей.

## Зачем инструмент {#why-you-use-a-tool}

Ручная генерация NKey оператора, записи, пользователя и подпись каждым правильным seed легко ошибается. Один неверный ключ приводит к отклонению JWT при входе.

**Nats auth** генерирует, подписывает и хранит всё в `$XDG_DATA_HOME/nats`: JWT в stores, секретные seed в keys. Запускайте на доверенной рабочей машине, не сервере. Результаты — JWT записей серверу и creds клиентам.

**Переход с nsc:** формат хранилища совместим, инструменты могут работать с одним деревом. В nats auth v0.4.0 ещё нет activation tokens и импорта одной записи в существующего оператора; для этого используйте nsc.

## Построение цепочки {#building-the-chain}

Создайте всё последовательностью:

<div class="nats-example" data-type="learn-security-operator-mode-auth-setup" data-languages="cli"></div>

```
Operator ACME (OBZITYNM2EAIJ4G5PZTH3XIRUIEIZH63YSFO2JKPNGWVFBGKBPEJP5WS)
  System Account: SYSTEM (ADAHVYCRL72B3US4VANPUIQXCNHFCQWFOCPOG7YDPPX36Z3DCJTHZP46)
    Signing Keys: OABMS7LJRLJ7RX3SMV7AK3MRTJHYFN4EY5ARSMR5SKZBTOWAKPCTKVO3

Account ORDERS (AC6S25M37MU5PJGKYF5QPJPJ6XDQZXJPIPTMCR5MK7ZALYQGX6MH4IRU)
                 Issuer: OBZITYNM2EAIJ4G5PZTH3XIRUIEIZH63YSFO2JKPNGWVFBGKBPEJP5WS

User order-svc (UAKAFPCC4KDEKCAKP47VXHEYGHSL4GDET65EE7LMHMD2PCRAAWP37U2B)
        Max Payload: 1,048,576
```

`nats auth operator add ACME` без вопросов также создаёт SYSTEM и ключ подписи оператора. SYSTEM заменяет прежний SYS; resolver использует её для внутренних запросов JWT.

Account add создаёт подписанные ACME ORDERS и ANALYTICS. Issuer — ключ оператора. Defaults пропускает вопросы ограничений соединений и подписок. Это те же [арендаторы](/learn/security/accounts-and-multitenancy), теперь JWT.

User add с credential сразу пишет файлы входа. Defaults включает Max Payload 1,048,576, то есть 1 МиБ, но не права: оба пока могут всё внутри своей записи. Области ключей добавим далее.

Идентификаторы начинаются O, A, U для оператора, записи и пользователя. Начальный S, например SO/SA/SU, означает **секретный seed**: обращайтесь осторожно.

## Данные, предъявляемые клиентом {#the-credentials-the-client-presents}

Обычного JWT недостаточно: это публичное утверждение. Для подписи запроса нужен приватный seed, поэтому credential объединяет оба.

Исключение — явно включаемый Bearer JWT; избегайте, если он не нужен соединениям WebSocket.

В order-svc.creds два раздела:

```
-----BEGIN NATS USER JWT-----
eyJ0eXAiOiJKV1QiLCJhbGciOiJlZDI1NTE5LW5rZXkifQ.eyJqdGkiOiJDSzNRR1M3...
------END NATS USER JWT------

-----BEGIN USER NKEY SEED-----
SUAHXZJM6LTGNPTO34IWIJYDYT2PLJGEYRMASUR4E33NR4RNKZY3KZ3RGU
------END USER NKEY SEED------
```

Первый публичен, второй — закрытый ключ подписи, не покидающий клиента. Файл защищайте как пароль и предоставляйте только использующему клиенту. Повторную копию создаёт `nats auth user credential order-svc.creds order-svc ORDERS`.

## Зачем resolver {#why-the-server-needs-a-resolver}

Клиент предъявляет JWT и подпись nonce. Сервер должен проверить, что подписавшая ORDERS доверена ACME. Без JWT ORDERS цепочка не завершается.

**Account resolver** указывает источник JWT записей. Рекомендуется полный NATS-based: локальный каталог заполняется через соединение. Есть memory, cache, URL — см. [resolver](/reference/config/resolver), но nats auth push поддерживает только полный.

Интерактивный `nats server generate ./acme-server` с шаблоном `'nats auth' managed NATS Server configuration` создаёт server.conf:

```conf
# Generated NATS Server configuration operated by operator ACME
server_name: acme-1
listen: 0.0.0.0:4222
monitor_port: 8222

# The JWT token of the operator running the server (ACME)
operator: eyJ0eXAiOiJKV1QiLCJhbGciOiJ...

# The JWT token of the system account managing the server (ACME)
system_account: ADAHVYCRL72B3US4VANPUIQXCNHFCQWFOCPOG7YDPPX36Z3DCJTHZP46

resolver_preload {
    // Account: SYSTEM
    ADAHVYCRL72B3US4VANPUIQXCNHFCQWFOCPOG7YDPPX36Z3DCJTHZP46: eyJ0eXAiOiJKV1QiLCJhbGciOiJ...
}

# Configures the Full NATS Resolver
resolver {
   type: full
   dir: /var/lib/nats/resolver
   allow_delete: true
   interval: "2m"
   limit: 1000
}
```

Operator содержит полный JWT, не голый ключ. System_account — SYSTEM, resolver_preload включает её JWT для первого входа до push. Resolver.dir хранит по файлу записи.

Запустите и проверьте корень доверия в журнале:

```sh
nats-server -c ./acme-server/server.conf
```

```
[INF] Trusted Operators
[INF]   System  : ""
[INF]   Operator: "ACME"
[INF]   Issued  : 2026-07-03 14:18:32 +0200 CEST
[INF]   Expires : Never
[INF] Server is ready
```

## Заполнение resolver {#filling-the-resolver}

Каталог ещё пуст; обычный пользователь не войдёт:

```bash
nats pub orders.created '{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}' --creds order-svc.creds
```

```
nats: error: nats: Authorization Violation
```

Передайте JWT:

<div class="nats-example" data-type="learn-security-operator-mode-resolver-start" data-languages="cli"></div>

```
Updating account ORDERS (AC6S25M37MU5PJGKYF5QPJPJ6XDQZXJPIPTMCR5MK7ZALYQGX6MH4IRU) on 1 server(s)

✓ Update completed on acme-1

Success 1 Failed 0 Expected 1
```

Admin входит через заранее загруженную SYSTEM. Каждый account push пишет одну запись; `Success 1 Failed 0 Expected 1` — подтверждение одного сервера. Повторите для ORDERS и ANALYTICS. Прочитать серверную копию можно `nats auth account query ORDERS -s nats://127.0.0.1:4222 --creds sys.creds`.

Пользовательские JWT не передаются заранее и не хранятся списком на сервере. Клиент приносит свой при входе, сервер помнит сведения на время соединения.

## Подключение с creds {#connecting-with-the-credentials}

Теперь доверие и JWT записей готовы для публикации order-svc.

<div class="nats-example" data-type="learn-security-operator-mode-connect-creds" data-languages="cli"></div>

```
14:19:47 Published 91 bytes to "orders.created"
```

Библиотека читает JWT и подписывает nonce seed. Сервер проверяет подписи ORDERS и ACME и владение пользовательским ключом; заказ 91 байт публикуется.

<div class="nats-flow" data-scenario="resolverPushAnimated" data-width="600" data-height="380"></div>

Два этапа: push помещает запись в resolver, connect проверяет по ней цепочку пользователя.

User/password не нужны. Сервер знает корень доверия вместо списка пользователей. Экспорт/импорт тоже переходит в JWT, как описано в [Межаккаунтном обмене](/learn/security/cross-account).

## Типичные ошибки {#pitfalls}

Обычно расходятся локальное хранилище и resolver либо утекает creds.

**Изменение без push.** Account edit меняет лишь локальный JWT, сервер применяет старые права и пределы. После каждого изменения push и account query для проверки.

<div class="nats-example" data-type="learn-security-operator-mode-push-after-edit" data-languages="cli"></div>

```
Updating account ORDERS (AC6S25M37MU5PJGKYF5QPJPJ6XDQZXJPIPTMCR5MK7ZALYQGX6MH4IRU) on 1 server(s)

✓ Update completed on acme-1

Success 1 Failed 0 Expected 1
```

После push Connections станет 50, до него останется unlimited.

**Нет системной записи.** NATS-based resolver без неё не запускается: `using nats based account resolver - the system
account needs to be specified in configuration or the operator jwt`. Штатные operator add и generate задают SYSTEM автоматически; проблема возникает у ручного JWT или импорта.

**Утечка creds.** Обладатель seed войдёт без угадывания пароля. Не включайте в образ, журнал или git; права 0600, подключение только нужному клиенту. Для блокировки отзовите пользователя и push записи; подробнее [далее](/learn/security/decentralized-auth).

**Истечение срока.** Срок данных входа уменьшает последствия компрометации без смены ключа подписи, но требует наблюдения и обновления до истечения.

## Что уже готово {#where-you-are}

Та же система без списка пользователей:

- ACME — корень, хранилище на вашей машине.
- ORDERS и ANALYTICS подписаны и переданы full resolver.
- Пользователи имеют creds, пока без ограничений прав.
- Конфигурация содержит operator JWT, SYSTEM и resolver.

Order-svc публикует как прежде; изменился способ доверия.

## Что дальше {#whats-next}

Разберём проверки, scoped-права, отзыв и сроки.

Перейдите к [Децентрализованной аутентификации](/learn/security/decentralized-auth).

## См. также {#see-also}

- [resolver](/reference/config/resolver) — типы.
- [operator](/reference/config/operator) — JWT доверия.
- [Децентрализованная аутентификация](/learn/security/decentralized-auth) — подписи.
- [Основные понятия → Безопасность](/concepts/security).
