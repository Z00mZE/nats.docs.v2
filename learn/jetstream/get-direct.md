---
id: get-direct
title: "Прямое чтение сообщений"
sidebar_position: 19
description: "Чтение сообщения или ограниченного пакета прямо из потока без потребителя с любой реплики"
---

# Прямое чтение сообщений {#reading-messages-directly}

[Чтение потока](/learn/jetstream/reading-back) использовало потребителя для последовательного прохода с сохраняемой позицией. Для одной записи по номеру или последней по теме этого не требуется.

Можно запросить сообщение прямо из хранилища.

## Одно сообщение {#get-one-message}

Укажите номер из PubAck:

<div class="nats-example"
     data-type="learn-jetstream-get-direct-by-sequence"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

```
Item: ORDERS#2 received 2026-05-22 10:14:25 +0000 UTC (36h2m11s) on Subject orders.created

{"order_id":"ord_2zr9","customer":"globex","total_cents":7800,"ts":"2026-05-22T10:14:25Z"}
```

Чаще известна тема: `--last-for` возвращает её последнее сообщение.

<div class="nats-example"
     data-type="learn-jetstream-get-direct-last-for-subject"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

```
Item: ORDERS#3 received 2026-05-22 10:14:31 +0000 UTC (36h2m05s) on Subject orders.shipped

{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:31Z"}
```

Так устроен get в [Key-Value](/learn/key-value): ключ — тема потока, значение — её последняя запись.

Оба обычных запроса идут лидеру и видят только что записанное.

## Direct Get с любой реплики {#direct-get-reads-from-any-replica}

Для частых или удалённых чтений **Direct Get** даёт те же выборки, но отвечает любой сервер с копией, не только лидер.

<div class="nats-flow" data-scenario="directGetAnimated" data-width="680" data-height="300"></div>

Нужен `allow_direct`. В `nats stream info ORDERS` включение видно как `Direct Get: true`; без него строка отсутствует. CLI включает новым потокам автоматически. Для остальных:

<div class="nats-example"
     data-type="learn-jetstream-get-direct-enable"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Прямой API получает номер 1 с любой реплики:

<div class="nats-example"
     data-type="learn-jetstream-get-direct-direct-read"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

```
Subscribing to JetStream Stream (direct) holding messages with subject orders.> starting with sequence 1
[#1] Received JetStream message (direct): stream: ORDERS seq 1 / subject: orders.created / time: 2026-05-22 10:14:22
```

Метка `(direct)` означает локальное хранилище вместо обычного запроса лидеру. Это распределяет чтение. Зеркало с `mirror_direct` тоже отвечает за источник, позволяя использовать ближайшую [копию](/learn/jetstream/mirrors-and-sources).

Цена — свежесть: **нет гарантии чтения после записи**. Реплика или зеркало могут отставать. Для кеша или панели это допустимо, для проверки своей публикации используйте `nats stream get` у лидера.

## Пакет одним запросом {#get-a-batch-in-one-request}

Direct Get передаёт диапазон за один обмен вместо запроса каждого сообщения. Три с номера 1:

<div class="nats-example"
     data-type="learn-jetstream-get-direct-batch-get"
     data-languages="cli,js,go,java,rust,csharp"></div>

`Nats-Num-Pending` сообщает остаток совпадений и достигает `0` на последнем:

```
[#1] ... seq 1 ...   Nats-Num-Pending: 2
[#2] ... seq 2 ...   Nats-Num-Pending: 1
[#3] ... seq 3 ...   Nats-Num-Pending: 0
```

<div class="nats-flow" data-scenario="batchGetAnimated" data-width="680" data-height="300"></div>

Доступны диапазон, последние нескольких тем (`--last-per-subject`) и срез по времени, ограниченные количеством или байтами. Поля `batch`, `max_bytes`, `multi_last` — в [справочнике](/reference/jetstream/api/stream/msg-get). nats.js поддерживает напрямую, Go, Rust, Java, C# — через [Synadia Orbit](https://github.com/synadia-io).

Это разовый снимок, не подписка: новые сообщения должен получать потребитель.

## Direct Get или потребитель? {#direct-get-or-a-consumer}

Назначения различаются:

- **Direct Get** или `nats stream get` — точечная выборка по номеру, последнего значения либо пакета. Без ack и позиции; прямому API отвечает любая реплика.
- **[Потребитель](/learn/jetstream/reading-back)** — проход журнала с долговременной позицией, подтверждениями и новыми сообщениями.

Прямое чтение не двигает потребителей и не удаляет данные.

## Типичные ошибки {#pitfalls}

Частые неверные предположения:

**Direct Get выключен.** На прямую тему никто не отвечает, запрос заканчивается тайм-аутом. Проверьте `Direct Get: true` либо `nats stream edit
ORDERS --allow-direct`.

**Прямая копия может отставать.** Для свежей записи используйте лидера; Direct Get — для распределённых чтений с допустимой задержкой.

**Пакет не подписка.** После накопленных данных он заканчивается. Для продолжения нужен потребитель.

## Что уже готово {#where-you-are}

ORDERS прежний. Дополнительно к [потребителю](/learn/jetstream/reading-back) доступны:

- `nats stream get` — актуальное чтение лидера по номеру или последней теме.
- Direct Get, `--direct` — любая реплика или зеркало и пакеты одним запросом, с возможным отставанием.
- Различие точечного чтения и прохода журнала.

## Что дальше {#whats-next}

[Сопоставление тем](/learn/jetstream/subject-mapping) меняет темы на входе и выходе потока.

## См. также {#see-also}

- [ADR-31](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-31.md) — запросы Direct Get и заголовки.
- [Конфигурация потока](/reference/jetstream/api/stream/create) — allow_direct, mirror_direct.
- [Чтение потока](/learn/jetstream/reading-back) — долговременный курсор.
- [Зеркала и источники](/learn/jetstream/mirrors-and-sources) — близкие читателю копии.
