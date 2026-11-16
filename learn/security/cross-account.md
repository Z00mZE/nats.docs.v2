---
id: cross-account
title: "Межаккаунтный обмен"
sidebar_position: 5
description: "Одна общая тема двух изолированных записей через экспорт и импорт"
---

# Межаккаунтный обмен {#cross-account}

ORDERS и ANALYTICS изолированы: order-svc публикует внутри первой, analytics-reader подписывается внутри второй.

Иногда нужно намеренное совместное использование.

Аналитике необходимо считать orders.shipped, но одинаковой подписки недостаточно.

Откроем только эту тему, сохранив остальные границы.

## Экспорт и импорт {#export-and-import}

Нужны согласованные декларации обеих сторон.

**Экспорт** предлагает тему владельца другим: ORDERS экспортирует orders.shipped.

**Импорт** выбирает тему и запись владельца и включает в локальное пространство ANALYTICS.

Экспорт без импорта ничего не переносит. Импорт без экспорта отклоняет конфигурацию при запуске.

## Тип экспорта {#what-kind-of-export}

**Stream export** — односторонний pub/sub. ORDERS публикует, ANALYTICS читает. С потоками JetStream название не связано: stream здесь означает поток сообщений через границу.

**Service export** — двусторонний request/reply, например запрос цены ORDERS из ANALYTICS. Здесь не нужен; подробнее в [exports](/reference/config/accounts/exports).

## Экспорт ORDERS {#export-the-subject-from-orders}

Добавьте exports к записи. Пользователи, права, SYS и system_account прежние; пример показывает только арендаторов:

```conf
accounts {
  ORDERS: {
    jetstream: enabled
    users: [
      { user: order-svc, password: s3cr3t,
        permissions: {
          publish: { allow: ["orders.>"] }
          subscribe: { allow: ["_INBOX.>"] }
        }
      }
    ]
    exports: [
      { stream: "orders.shipped" }
    ]
  }
  ANALYTICS: {
    users: [
      { user: analytics-reader, password: an4lytics }
    ]
  }
}
```

Ключ `stream:` задаёт одновременно тип и тему. Service использовал бы `service:`.

Без ограничений экспорт **публичный**, импорт доступен любой записи сервера. Для выбранных перечислите accounts:

```conf
{ stream: "orders.shipped", accounts: [ANALYTICS] }
```

Здесь достаточно публичного.

Более сложные ограничения есть в [режиме оператора](./operator-mode.md).

## Импорт ANALYTICS {#import-the-subject-into-analytics}

Добавьте соответствующий imports:

```conf
accounts {
  ORDERS: {
    jetstream: enabled
    users: [
      { user: order-svc, password: s3cr3t,
        permissions: {
          publish: { allow: ["orders.>"] }
          subscribe: { allow: ["_INBOX.>"] }
        }
      }
    ]
    exports: [
      { stream: "orders.shipped" }
    ]
  }
  ANALYTICS: {
    users: [
      { user: analytics-reader, password: an4lytics }
    ]
    imports: [
      { stream: { account: ORDERS, subject: "orders.shipped" } }
    ]
  }
}
```

Stream должен совпадать с типом, account — ORDERS, subject — исходная orders.shipped.

Примените `nats-server --signal reload=<pid>` или перезапустите. Теперь тема появляется и в ANALYTICS.

По умолчанию имя прежнее. Prefix или to меняют локальное имя против конфликтов; здесь не нужны. См. [imports](/reference/config/accounts/imports).

## Проверка обмена {#see-the-sharing-work}

Публикация order-svc и подписка analytics-reader связываются только экспортом/импортом.

<div class="nats-flow" data-scenario="crossAccountExportAnimated" data-width="600" data-height="380"></div>

Анимация также показывает неэкспортированную orders.created внутри ORDERS. Проверьте shipped:

<div class="nats-example" data-type="learn-security-cross-account-consume-imported" data-languages="cli"></div>

Вывод подписчика:

```
14:19:26 Subscribing on orders.shipped
[#1] Received on "orders.shipped"
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

Заказ ord_8w2k поступает с тем же именем. Издатель не знает импортёра и выводит обычное `Published 91 bytes to "orders.shipped"`. Связь полностью в серверной конфигурации.

## Остальная изоляция {#the-isolation-still-holds-everywhere-else}

Orders.created и orders.canceled по-прежнему не видны ANALYTICS.

Exports перечисляет всё, что разрешено вынести из записи.

Третья запись тоже должна импортировать, возможно под другим именем без влияния на существующих.

## Та же связь у оператора {#the-same-share-in-operator-mode}

В [режиме оператора](/learn/security/operator-mode) декларации находятся в JWT: `nats auth account exports add Shipments "orders.shipped" ORDERS` и `nats auth account imports add Shipments "orders.shipped" ANALYTICS
--source <ORDERS-public-key> --local orders.shipped`. Обе записи нужно push. До этого связи нет без проверки запуска. В nats auth нет activation tokens: `--token-position` ограничивает wildcard-тему открытым ключом импортирующей записи.

## Типичные ошибки {#pitfalls}

Несовпадения сторон:

**Экспорт без импорта молчит, обратное останавливает сервер.** Проверьте account импорта. Отсутствующий экспорт даёт при запуске:

```
nats-server: nats.conf:2:1: Error adding stream import "orders.shipped": stream import not authorized
```

В JWT-режиме непереданный импорт молча не действует. Проверяйте публикацией и подпиской.

**Типы не взаимозаменяемы.** Если импорт service orders.price существует, но отвечающего в ORDERS нет, приходит `No responders are available`:

<div class="nats-example" data-type="learn-security-cross-account-service-no-responders" data-languages="cli"></div>

```
14:19:42 Sending request on "orders.price"
14:19:42 No responders are available
```

CLI выводит статус и код 0 без ожидания. Запустите responder. Без импорта ответ такой же, поскольку запрос остаётся ANALYTICS. Несовпавший с экспортом импорт отвергается раньше, при запуске.

**Переименованный импорт требует нового имени подписки.** Prefix/to меняет локальную тему, а не публикацию владельца.

## Что уже готово {#where-you-are}

Одна явная связь:

- ORDERS публично экспортирует stream orders.shipped.
- ANALYTICS импортирует её.
- Analytics-reader получает отправки.
- Остальные события изолированы.

## Что дальше {#whats-next}

Конфигурационная модель завершена: вход, права, записи, обмен. Теперь уберём список пользователей с сервера.

Перейдите к [Режиму оператора](/learn/security/operator-mode).

## См. также {#see-also}

- [exports](/reference/config/accounts/exports) — accounts, response_type.
- [imports](/reference/config/accounts/imports) — prefix, to.
- [Режим оператора](/learn/security/operator-mode) — подписанные JWT.
- [Основные понятия → Безопасность](/concepts/security).
