---
id: accounts-and-multitenancy
title: "Учётные записи и многопользовательская изоляция"
sidebar_position: 4
description: "Изолированные пространства тем арендаторов и встроенные учётные записи"
---

# Учётные записи и многопользовательская изоляция {#accounts-and-multitenancy}

`order-svc` публикует `orders.>` и подписывается на `_INBOX.>`, `analytics-reader` пока не ограничен. Оба находятся в общем пространстве.

У команд разные владельцы и код; приватный трафик не должен смешиваться. Вместо растущих списков прав разделим их структурно по учётным записям.

## Учётная запись {#what-an-account-is}

**Учётная запись** — изолированный арендатор со своим пространством тем.

Публикации `ORDERS` видны только её подписчикам. Одинаковое имя `orders.shipped` в двух записях означает разные темы.

Права [предыдущей страницы](/learn/security/authorization) ограничивают пользователя внутри записи; граница записи исключает пересечение сама.

Платформе нужны:

- `ORDERS` — сервис с публикациями `orders.>`.
- `ANALYTICS` — читатель отправленных заказов.

Пока они полностью изолированы. Явная связь — [Межаккаунтный обмен](/learn/security/cross-account).

<div class="nats-flow" data-scenario="accountIsolationAnimated" data-width="600" data-height="380"></div>

В анимации одинаковую `orders.shipped` получает лишь подписчик ORDERS, не analytics-reader.

## Уже существующие записи {#the-two-accounts-you-already-have}

До ваших записей сервер предоставляет две.

**`$G`** — глобальная. В ней живут подключения без accounts и прежние два пользователя. Начальное плоское пространство — тоже учётная запись.

**`$SYS`** — системная для мониторинга и управления, например `$SYS.SERVER.>`. В других записях подписка на такое имя принимается, но ничего не получает: отвечающие расположены только в системном пространстве.

Только `$G` зарезервировано: объявить его нельзя. Собственную `$SYS` объявить можно, она автоматически системная, но для своих имён яснее избегать $. Системную запись меняет верхний `system_account`.

Системные темы и события — в [справочнике](/reference/system).

## Минимальная конфигурация {#a-minimal-two-account-config}

Добавьте верхний accounts к конфигурации из [Основ аутентификации](/learn/security/authentication-basics) и перенесите пользователей внутрь. Права order-svc прежние. Удалите прежний authorization, иначе оставшиеся там пользователи будут в $G.

```conf
accounts {
  ORDERS: {
    jetstream: enabled
    users: [
      {
        user: order-svc
        password: s3cr3t
        permissions: {
          publish: { allow: ["orders.>"] }
          subscribe: { allow: ["_INBOX.>"] }
        }
      }
    ]
  }
  ANALYTICS: {
    users: [
      { user: analytics-reader, password: an4lytics }
    ]
  }
}
```

Имена верхних элементов ORDERS и ANALYTICS определяют арендаторов и используются в обмене и журналах.

Users задаёт пользователей записи; один пользователь принадлежит одной. Имена уникальны на сервере, иначе запуск: `Duplicate user "order-svc" detected`. Поддерживаются прежние пароль и NKey.

Права order-svc теперь разрешают темы только внутри ORDERS; граница защищает от других.

[`jetstream: enabled`](/reference/config/accounts/jetstream) включает JetStream для записи. Без него API даёт `JetStream not enabled for account (10039)`. ANALYTICS поток не нужен. Старый поток из $G не перемещается вслед за пользователем: при необходимости создайте ORDERS заново в новой записи.

Запустите:

```sh
nats-server -c nats.conf
```

При наличии арендаторских записей анонимный вход больше не допускается: нужен пользователь одной из них.

```sh
nats pub orders.shipped 'hi'
```

```text
nats: error: nats: Authorization Violation
```

Но accounts только с системной записью всё ещё допускает анонимных в $G: закрывает именно наличие арендаторов.

## Проверка границы {#verifying-the-account-boundary}

Опубликуйте order-svc и подпишитесь analytics-reader на orders.shipped. Между записями ничего не придёт.

<div class="nats-example" data-type="learn-security-accounts-and-multitenancy-isolation" data-languages="cli"></div>

```text
14:20:15 Subscribing on orders.shipped
14:20:16 Published 91 bytes to "orders.shipped"
```

91 байт опубликован в ORDERS, но ANALYTICS выводит лишь Subscribing on.

Положительная проверка: опубликуйте ту же нагрузку как analytics-reader; местный подписчик получит сразу.

```text
[#1] Received on "orders.shipped"
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

Проверка выполняется внутри ANALYTICS, поскольку подписка order-svc на orders.shipped запрещена: `Permissions Violation for Subscription to "orders.shipped"`.

Теперь order-svc делает request к той же теме при существующем подписчике ANALYTICS:

```text
14:20:18 Sending request on "orders.shipped"
14:20:18 No responders are available
```

`No responders are available` приходит немедленно: внутри ORDERS отвечающих нет. При неожиданном no responders проверяйте учётные записи сторон.

Одну тему намеренно пропустит [Межаккаунтный обмен](/learn/security/cross-account).

## За рамками {#what-we-arent-configuring-yet}

У записи есть и другие возможности.

**Ограничения** соединений и JetStream-хранения, а также события — эксплуатационная тема. Поля в [справочнике](/reference/config/accounts/limits).

**Экспорт/импорт** — намеренный переход темы через границу; [следующая страница](/learn/security/cross-account).

Все поля — в [accounts](/reference/config/accounts). Здесь users и jetstream.

## Типичные ошибки {#pitfalls}

Практические проблемы:

**No_auth_user снова открывает доступ.** Он помещает анонимных в запись выбранного пользователя. Не назначайте широкого пользователя $G, задайте узкого. Параметр не вводится и не меняется reload: `config reload not supported for NoAuthUser`, нужен рестарт. `nats-server -t` не обнаружит отсутствующего пользователя, ошибка появится при запуске. С доверенным оператором настройка запрещена. См. [no_auth_user](/reference/config/no_auth_user).

**В системной записи нет пользователя.** Тогда события и управление недоступны. Создайте SYS с пользователем и [`system_account: SYS`](/reference/config/system_account). Это остаётся в дальнейших конфигурациях:

```conf
accounts {
  # ORDERS and ANALYTICS unchanged
  SYS: {
    users: [ { user: sys-admin, password: syspass } ]
  }
}
system_account: SYS
```

Проверим разницу арендатора и системного пользователя:

<div class="nats-example" data-type="learn-security-accounts-and-multitenancy-system-account-reachable" data-languages="cli"></div>

```text
                      User: analytics-reader
                   Account: ANALYTICS (ANALYTICS)
            System Account: false
```

analytics-reader видит свою запись и System Account: false. sys-admin — Account: SYS (SYS), true, сведения любых записей через nats server account info и события `$SYS.SERVER.ACCOUNT.ANALYTICS.CONNS`. У order-svc даже строка Account может отсутствовать: его allow блокирует `$SYS.REQ.USER.INFO`.

**Одинаковое имя не связывает записи.** Для orders.shipped требуется явный [экспорт/импорт](/learn/security/cross-account).

## Что уже готово {#where-you-are}

Конфигурация содержит:

- ORDERS с JetStream и правами order-svc.
- ANALYTICS с пока неограниченным analytics-reader.
- SYS с пользователем, назначенную системной.
- Встроенные глобальные механизмы $G/$SYS.

Изоляция проверена: публикация одной не достигает другой.

## Что дальше {#whats-next}

Аналитике нужны отправленные заказы. Откроем только orders.shipped: [Межаккаунтный обмен](/learn/security/cross-account).

## См. также {#see-also}

- [accounts](/reference/config/accounts) — все параметры.
- [system](/reference/system) — события и управление.
- [Межаккаунтный обмен](/learn/security/cross-account).
- [Основные понятия → Безопасность](/concepts/security).
