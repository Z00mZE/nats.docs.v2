---
id: decentralized-auth
title: "Децентрализованная аутентификация"
sidebar_position: 7
description: "Проверка цепочки оператор — запись — пользователь, области ключей, отзыв и срок действия"
---

# Децентрализованная аутентификация {#decentralized-authentication}

[Режим оператора](/learn/security/operator-mode) создал ACME, передал ORDERS/ANALYTICS resolver и подключил order-svc через creds. Теперь объясним проверку и вернём ограничение orders.>: перевыпустим пользователя scoped-ключом, зададим срок и отзыв.

## Проблема общего списка {#the-problem-with-one-big-user-list}

Через год у ORDERS пятнадцать сервисов, у ANALYTICS восемь и появляется третья команда. В централизованной модели добавить каждого может только владелец конфигурации сервера.

Команды должны управлять своими пользователями самостоятельно. Серверу достаточно проверки подлинности подписи, как при создании order-svc без изменения серверного списка.

## Три звена доверия {#the-three-identities-in-the-trust-chain}

Идентичности образуют цепочку.

**Оператор** ACME — корень, которому явно доверяет сервер.

**Учётные записи** ORDERS и ANALYTICS — арендаторы из [предыдущей темы](/learn/security/accounts-and-multitenancy), за которых ручается оператор.

**Пользователи** order-svc и analytics-reader принадлежат записям, которые ручаются за них.

«Ручается» означает подпись. Проверка любого звена поднимается до корня.

<div class="nats-flow" data-scenario="decentralizedAuthAnimated" data-width="600" data-height="380"></div>

## Ключи подписи {#how-an-identity-signs-the-next}

**NKeys** основаны на Ed25519, как современные SSH и подпись кода. Открытый ключ проверяет, закрытый seed подписывает. Сервер обрабатывает открытые ключи и подписи, не seed.

Префиксы: O — оператор, A — запись, U — пользователь, S перед ними — seed. OD2A... публичен, SUAH... секретен.

Кроме ключа идентичности есть дополнительные **ключи подписи**. Запись выдаёт ими пользователей, оператор — записи. JWT пользователя содержит issuer_account с родительской записью. При обычном ключе связь может быть неявной.

## Пользовательский JWT {#the-user-jwt}

**JWT** — подписанный документ утверждений, включая открытый ключ владельца, подписавшего запрос сервера. Подпись защищает поля от изменения.

Это не token-пароль [основ аутентификации](/learn/security/authentication-basics). JWT публично читается, но создать его может только надлежащий ключ записи. Первый раздел creds содержит JWT, второй seed.

Сервер видит выдавшую запись в пользовательском JWT, получает её JWT из resolver и проверяет подпись оператора.

## Проверки сервера {#what-the-server-actually-checks}

В конфигурации `operator: eyJ...` содержит открытый ключ и дополнительные ключи подписи, допускающие записи.

При каждом входе сервер создаёт случайный **nonce**. Клиент возвращает подпись seed вместе с JWT.

Проверяются:

1. Подпись nonce открытым ключом пользователя: владение seed сейчас.
2. Подпись JWT пользователя ключом идентичности записи или её signing key.
3. Подпись JWT записи ключом из доверенного operator JWT.

После успеха применяются права и ограничения JWT.

Копия JWT без seed не пройдёт первую проверку. Самодельный JWT пользователя без ключа ORDERS — вторую. Поддельная запись без ключа оператора — третью.

Исключение — bearer ниже.

## Почему это масштабируется {#why-removing-the-user-list-matters}

Подпись проверяется и для неизвестного ранее пользователя без предварительной серверной записи.

Каждая команда выдаёт своих пользователей собственными ключами. Сервер доверяет обеим через подписи оператора без изменения конфигурации.

## Права через scoped-ключ {#scoped-permissions-with-a-signing-key}

Order-svc пока шире прежней [авторизации](/learn/security/authorization). **Scoped signing key** задаёт роль с фиксированными правами всем выданным пользователям. Перевыпустите от order-writer:

<div class="nats-example" data-type="learn-security-decentralized-auth-scoped-signing-key" data-languages="cli"></div>

```
Scoped Signing Key ACQFRPTMQBCYT7QB2PRHW3XEMBZYXLOXT5V7IBYTZP3CBPV6VCW2ME5E
...
Removed user order-svc
...
User order-svc (UASBX5L3X7MSAAAPVRKNAQFRMAFKP4VOKB6O3ZZ72QYD2DQCL2W4TP5K)

Configuration:

            Account: ORDERS (AC6S25M37MU5PJGKYF5QPJPJ6XDQZXJPIPTMCR5MK7ZALYQGX6MH4IRU)
             Issuer: ACQFRPTMQBCYT7QB2PRHW3XEMBZYXLOXT5V7IBYTZP3CBPV6VCW2ME5E
             Scoped: true
...
Permissions:

  Publish:

                Allow: orders.>

  Subscribe:

                Allow: _INBOX.>
```

Issuer теперь ACQFRPTM..., а Scoped: true означает шаблон роли: publish orders.>, subscribe `_INBOX.>`.

Ключ находится в JWT ORDERS. До push сервер его не знает и отклоняет creds:

```sh
nats pub orders.created '{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200}' --creds order-svc.creds
```

```
nats: error: nats: Authorization Violation
```

Передайте `nats auth account push ORDERS -s nats://127.0.0.1:4222 --creds sys.creds` и повторите:

```
14:24:53 Published 63 bytes to "orders.created"
```

За пределами области — уже ошибка прав, а не входа:

```sh
nats pub billing.charge 'x' --creds order-svc.creds
```

```
nats: error: nats: permissions violation: Permissions Violation for Publish to "billing.charge"
```

В пользовательском JWT права пусты (`"pub": {}, "sub": {}`). Сервер берёт шаблон ключа. Его смена через account push распространяется всем выданным пользователям без перевыпуска creds. Но CLI v0.4.0 ещё не редактирует область на месте.

`--expire 720h` задаёт creds срок 30 дней. Он принадлежит выпущенному JWT, не хранимому пользователю; обновляйте через user credential.

## Отзыв пользователя {#revoking-a-user}

`user rm` без revoke удаляет лишь локальную запись, старые creds работают. `--revoke` добавляет в JWT записи карту revocations: открытый ключ → время. JWT этого ключа, выданные до времени включительно, отвергаются после account push; существующие соединения отключаются. Проверьте полный цикл:

<div class="nats-example" data-type="learn-security-decentralized-auth-revocation-lifecycle" data-languages="cli"></div>

```
18:04:03 Published 63 bytes to "orders.created"
Removed user order-svc
18:04:03 Published 63 bytes to "orders.created"
...
✓ Update completed on acme-1
...
18:04:04 >>> Disconnected due to: EOF, will attempt reconnect
...
nats: error: nats: Authorization Violation
...
18:04:19 Published 63 bytes to "orders.created"
```

Между rm --revoke и push старые creds ещё входят. Перевыпущенный order-svc с тем же именем, но новым ключом, после push работает: отзыв относится к старому ключу.

## Токены предъявителя {#bearer-tokens}

У **bearer** нет nonce-подписи: любой обладатель JWT входит без seed. По умолчанию записи запрещают. Нужен --bearer и для account add/edit, и для user add. Это удобно браузерам/WebSocket без безопасного места для seed, но JWT становится секретом. Обычный JWT без seed отклоняется. Проверьте оба варианта:

<div class="nats-example" data-type="learn-security-decentralized-auth-bearer-token" data-languages="cli"></div>

```
nats: error: nats: Authorization Violation
...
       Bearer Token: true
...
nats: error: nats: Authorization Violation
...
  Bearer Tokens Allowed: true
...
18:05:09 Published 62 bytes to "orders.created"
```

Оба отказа выглядят Authorization Violation: отсутствие подписи либо запрет bearer записи. Только после push разрешения account JWT входит самостоятельно.

## Несколько операторов {#multiple-operators}

Сервер допускает несколько равноправных операторов с общим плоским пространством записей. Теоретически после компрометации можно постепенно переподписать существующие записи новым оператором.

Миграция сложна и не имеет удобных инструментов.

Предпочитайте operator signing keys: хотя бы один офлайн, один под рабочим риском. Переключаться между ними проще, хотя вспомогательных средств тоже мало.

## Типичные ошибки {#pitfalls}

Четыре ловушки:

**Потеря seed оператора.** Без него нельзя подписывать записи. `nats auth operator backup ACME acme-operator.backup` сохраняет переносимый JSON со всеми ключами и JWT, включая открытый seed без шифрования. `--key` с файлом curve NKey шифрует. Восстановление — `nats auth operator restore ACME acme-operator.backup`. Храните отдельно офлайн.

**Seed вместо открытого ключа.** В конфигурации и JWT нужны O/A/U. Утечка S... в файл, чат или журнал требует ротации. Считайте её паролем.

**Подпись главным ключом записи.** Обычный user add это позволяет, но ключ выдаёт любые права. Scoped key ограничивает последствия утечки; см. [ADR-14](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-14.md). CLI не меняет область на месте: account keys rm --key принимает роль или ключ, затем добавление создаёт новый. Все пользователи старого после push теряют доступ с nats: Authorization Violation. Это массовый отзыв, не правка.

**Нет плана обновления creds.** User add создаёт бессрочный JWT. В v0.4.0 срок задаётся только `nats auth user credential order-svc.creds order-svc ORDERS --expire 720h -f`, не user add/edit. Планируйте продление. Истечение даёт Authorization Violation; обычный журнал — authentication error, debug — claim is expired.

## Что уже готово {#where-you-are}

ACME прежний, order-svc ограничен:

- Три проверки: nonce, пользователь, запись.
- Order-writer разрешает orders.> и `_INBOX.>`.
- Creds на 720 часов, прежний неограниченный ключ отозван.
- Analytics-reader остаётся обычным пользователем ANALYTICS.

## Что дальше {#whats-next}

Теперь передадим решение внешней системе, чьи данные NATS сам не читает.

Перейдите к [Auth callout](/learn/security/auth-callout).

## См. также {#see-also}

- [operator](/reference/config/operator) — корень доверия.
- [Основные понятия → Безопасность](/concepts/security).
- [Режим оператора](/learn/security/operator-mode) — создание.
- [ADR-14](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-14.md) — scoped-ключи.
