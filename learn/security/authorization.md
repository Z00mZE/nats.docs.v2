---
id: authorization
title: "Авторизация"
sidebar_position: 3
description: "Права тем, allow и deny: разрешённый список закрывает всё остальное"
---

# Авторизация {#authorization}

[Основы аутентификации](/learn/security/authentication-basics) позволили order-svc и analytics-reader доказать личность и подключиться.

Сервер знает _кто_, но ещё не ограничил _что_: order-svc пока публикует и подписывается везде.

Авторизация задаёт разрешённые действия через темы.

## Права относятся к темам {#permissions-are-about-subjects}

**Право** разрешает публикацию или подписку на набор тем. Отдельных ролей администратора и типов ресурсов нет: доступ выражается темами.

Все операции проходят через темы; request/reply — публикация и подписка на ответ. Их ограничение контролирует всё достижимое клиентом.

Есть независимые списки публикаций и подписок. Разрешение одного не даёт другого.

Подстановки как в [темах](/concepts/subjects): * — один токен, > — один или больше конечных. orders.> включает также orders.at.northpole, в отличие от orders.*.

## Ограничение order-svc {#restricting-order-svc}

Сервис публикует orders.created/shipped/canceled и иногда делает запросы. Ответы приходят во временные `_INBOX.`. Значит нужны публикации orders. и собственные inbox.

Добавьте permissions к прежнему пользователю:

```conf
authorization {
  users: [
    {
      user: order-svc
      password: s3cr3t
      permissions: {
        publish: {
          allow: ["orders.>"]
        }
        subscribe: {
          allow: ["_INBOX.>"]
        }
      }
    }
    {user: analytics-reader, password: an4lytics}
  ]
}
```

Publish allow orders.> разрешает события заказов.

Subscribe allow `_INBOX.>` разрешает ответы. Префикс настраиваем, это стандарт.

У analytics-reader блока нет, пока он не ограничен.

## Allow закрывает остальное {#an-allow-list-closes-everything-else}

Всё вне заданного allow запрещено.

`publish: { allow: ["orders.>"] }` закрывает billing.charge и `$JS.API.>`.

Без allow и deny доступ не ограничен, как у analytics-reader.

Пустой список не запрет: `publish: []` разбирается как отсутствие списка. Запретить всё — `publish: { deny: [">"] }`.

`default_permissions` внутри authorization действует только на пользователей без собственного блока. Собственные права полностью заменяют стандарт, не сливаются. См. [справочник](/reference/config/authorization/default_permissions).

Ограничение включается явным allow.

## Deny сильнее allow {#deny-beats-allow}

Для исключения из широкого orders.> не нужно перечислять все остальные темы:

```conf
publish: {
  allow: ["orders.>"]
  deny: ["orders.secret"]
}
```

Сервер проверяет allow, затем deny. Совпавший запрет отменяет разрешение: orders.created/shipped доступны, orders.secret — нет.

При сочетании списков последнее слово за deny.

## Наблюдение отказа {#observing-a-denial}

Перезапустите с конфигурацией. orders.created разрешён, billing.charge отклоняется.

<div class="nats-example" data-type="learn-security-authorization-denied" data-languages="cli"></div>

```
14:19:45 Published 91 bytes to "orders.created"
nats: error: nats: permissions violation: Permissions Violation for Publish to "billing.charge"
```

Первый pub сообщает 91 байт и код 0, второй — код 1. Сырой ответ: `-ERR 'Permissions Violation for Publish to
"billing.charge"'`.

Ошибка асинхронна, сообщение отбрасывается, соединение остаётся. Библиотеки журналируют, передают следующей операции или вызывают обработчик ошибок.

Запрещённый request выглядит как тайм-аут: никто не получил публикацию, ответ не придёт. API JetStream тоже запросы, поэтому nats stream info может вернуть context deadline exceeded. Смотрите серверный журнал:

```
[ERR] 127.0.0.1:57456 - cid:6 - "v1.51.0:go:NATS CLI Version v0.4.0" - "$G/user:order-svc" - Publish Violation - Subject "billing.charge"
```

Там указаны пользователь, $G и тема для поиска недостающего права.

## Та же модель в JWT {#the-same-model-under-decentralized-auth}

В [децентрализованной модели](/learn/security/decentralized-auth) списки находятся в подписанных JWT и меняются nats auth:

```bash
nats auth user edit order-svc ORDERS --pub-allow "orders.>"
```

Каждый флаг заменяет список целиком: передавайте полный набор. Со scoped signing keys списки пользователя пусты, права заданы областью ключа записи. Правила сервера те же.

## За рамками {#what-were-leaving-out}

Ещё три вида прав:

- **Ответы**, allow_responses: разрешение конкретного выданного reply без широкого publish.
- **Группы очередей**: `"orders.created billing-workers"` позволяет только подписку в указанной группе, не обычную. См. [permissions](/reference/config/authorization/users/permissions).
- **Импорт/экспорт** — связь учётных записей, не пользователя; см. [Межаккаунтный обмен](/learn/security/cross-account).

Все поля — в [permissions](/reference/config/authorization/users/permissions). Здесь publish, subscribe, allow, deny.

## Типичные ошибки {#pitfalls}

Четыре основные ловушки:

**Subscribe deny ломает ответы.** `subscribe: { deny: [">"] }` запрещает inbox. Добавленный allow не поможет: deny сильнее. Замените запрет на allow `_INBOX.>`.

<div class="nats-example" data-type="learn-security-authorization-inbox-timeout" data-languages="cli"></div>

```
14:20:30 Sending request on "orders.lookup"
```

CLI в ошибочной схеме может просто ждать и завершиться 0; журнал показывает `Subscription Violation - Subject
"_INBOX.<random>", SID 1`. Библиотеки возвращают тайм-аут. После исправления и запуска отвечающего запрос проходит:

```
14:20:11 Sending request on "orders.lookup"
14:20:11 Received with rtt 652µs
{"order_id":"ord_8w2k","status":"shipped"}
```

Отвечающему также нужен publish в reply. Для этого предназначен allow_responses.

**Пропущенная тема тоже закрыта.** orders.> уже включает orders.refunded, а перечисление только created/shipped — нет. Выбирайте шаблон реального пространства пользователя.

**Слишком широкий > открывает всё**, включая JetStream `$JS.API.>`. Ограничивайте префиксом, например orders.>.

**Запрет незаметен под wildcard-подпиской.** При allow orders.> и deny orders.audit.> точная подписка orders.audit.entry даёт `Permissions Violation for
Subscription to "orders.audit.entry"`. Широкая orders.> принимается, но audit фильтруется без ошибки и маркера пропуска. При потерях проверяйте deny.

<div class="nats-example" data-type="learn-security-authorization-wildcard-deny-filter" data-languages="cli"></div>

```
18:02:37 Subscribing on orders.audit.entry
nats: error: nats: permissions violation: Permissions Violation for Subscription to "orders.audit.entry"
```

Точная подписка завершается 1, широкая принимает только разрешённое:

```
18:02:45 Subscribing on orders.>
[#1] Received on "orders.created"
{"order_id":"ord_8w2k","status":"created"}
```

Публикация audit успешна, но доставка отфильтрована без ошибки клиента и без строки нарушения в журнале.

## Что уже готово {#where-you-are}

Order-svc ограничен задачей:

- Публикация orders.>, подписка `_INBOX.>`.
- Остальные публикации отклоняются и теряются.
- Analytics-reader пока не ограничен; оба в $G.

Два правила одинаковы для конфигурации и JWT: allow закрывает остальное, deny сильнее allow.

## Что дальше {#whats-next}

Пользователи ещё делят пространство тем. Создадим независимые учётные записи.

Перейдите к [учётным записям и изоляции](/learn/security/accounts-and-multitenancy).

## См. также {#see-also}

- [permissions](/reference/config/authorization/users/permissions) — поля.
- [default_permissions](/reference/config/authorization/default_permissions) — стандартные права.
- [Темы](/concepts/subjects) — подстановки.
- [Учётные записи](/learn/security/accounts-and-multitenancy) — независимые пространства.
