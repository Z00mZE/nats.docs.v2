---
id: subject-mapping
title: "Сопоставление и преобразование тем"
sidebar_position: 20
description: "Изменение тем при сохранении и повторная публикация в новые темы"
---

# Сопоставление и преобразование тем {#subject-mapping-and-transforms}

[Фильтр](/learn/jetstream/filtering) выбирает данные, не меняя тему. **Сопоставление** переписывает её в трёх местах:

- **На входе** — subject transform потока меняет сохраняемую тему.
- **На выходе** — republish выдаёт сохранённое в новые темы обычным подписчикам без потребителя.
- **При копировании** — преобразования зеркала или источника, см. [Зеркала и источники](/learn/jetstream/mirrors-and-sources).

Язык преобразований общий.

## Язык преобразований {#the-transform-language}

Пара `source → destination`: исходный фильтр с `*`/`>`, целевой шаблон с совпавшими токенами:

- `{{wildcard(1)}}` — токен первого `*`, `{{wildcard(2)}}` — второго; старый `$1` эквивалентен.
- `{{partition(n, 1)}}` хеширует первый токен в `0`…`n-1`. Значение всегда попадает в один раздел.
- Конечный `>` переносит остаток без изменений: orders.> → dash.orders.>.
- `{{split(1, -)}}`, `{{splitfromleft(1, 3)}}` делят токен по разделителю без кавычек, кроме точки, либо по позиции символа.

Полный список — в ADR-30 ниже. Обычно нужны wildcard и partition; split, splitfromleft/right и slicefromleft/right изменяют отдельный токен.

Проверьте без потока через `nats server mappings`, передав источник, цель и тему:

```bash
nats server mappings "orders.*" "orders.{{wildcard(1)}}.archived" orders.created
```

```
orders.created.archived
```

## Преобразование на входе {#rewrite-subjects-on-the-way-in}

**Subject transform** меняет тему при сохранении. Подписки потока прежние: совпавшее преобразуется, остальное сохраняется как есть. Сообщения не отбрасываются.

<div class="nats-flow" data-scenario="subjectTransformAnimated" data-width="680" data-height="300"></div>

Для детерминированного разбиения оставьте ORDERS и создайте временный поток ingest.*. Токен заказчика хешируется в три раздела:

<div class="nats-example"
     data-type="learn-jetstream-subject-mapping-transform"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Опубликуйте заказы нескольких заказчиков: результат — `orders.<bucket>.<customer>`.

```bash
nats pub ingest.acme   "an order"
nats pub ingest.globex "an order"
nats pub ingest.wayne  "an order"
nats stream subjects ORDERS-SHARDED
```

```
Subject         │ Count
orders.1.acme   │ 1
orders.1.globex │ 1
orders.2.wayne  │ 1
```

Фильтр `orders.1.>` всегда получает одну долю заказчиков. Изменение — `nats stream edit
--transform-source/--transform-destination`, удаление — `--no-transform`.

Уже сохранённые записи не переписываются; подробнее ниже.

## Повторная публикация в живые темы {#republish-to-live-subjects}

**Republish** повторно выдаёт каждую сохранённую запись в другую тему. Это дешёвое живое наблюдение для панели без потребителя и истории.

<div class="nats-example"
     data-type="learn-jetstream-subject-mapping-republish"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Обычная подписка видит поступающие заказы:

```bash
nats sub "dash.orders.>"
```

```
[#1] Received on "dash.orders.created"
Nats-Stream: ORDERS
Nats-Subject: orders.created
Nats-Sequence: 5
Nats-Time-Stamp: 2026-05-22T11:02:00Z
Nats-Last-Sequence: 4

{"order_id":"ord_5xk1","customer":"initech","total_cents":1500,"ts":"2026-05-22T11:02:00Z"}
```

Пять заголовков происхождения: `Nats-Stream`, `Nats-Subject`, `Nats-Sequence`, `Nats-Time-Stamp`, `Nats-Last-Sequence`. Последний — прежний номер *той же темы* либо `0`, что помогает обнаружить пропуск. Заголовки издателя тоже сохраняются.

`--republish-headers` исключает тела, добавляя их размер `Nats-Msg-Size`. Отключение — `nats stream edit ORDERS --no-republish`.

## Преобразование при копировании {#transform-while-copying}

Каждый источник или зеркало может менять пространство тем, например добавляя регион при агрегации. Это разобрано с механизмом [копирования](/learn/jetstream/mirrors-and-sources).

## Отличие от сопоставления учётной записи {#not-the-same-as-account-subject-mapping}

[Сопоставление Core NATS](/learn/core-nats/subject-mapping) настраивается серверу для учётной записи и меняет маршрутизацию до записи в поток. Это отдельный механизм.

## Типичные ошибки {#pitfalls}

Основные ловушки:

**Потерянный токен фильтра.** Шаблон сохраняет только указанные части. orders.* → orders.archived без `{{wildcard(1)}}` лишает потребителя фильтрации по типу. Сохраняйте нужные токены.

**Republish не заменяет потребителя.** Это Core без хранения, ack и повторов: отключённый читатель пропускает. Для наверстывания нужна долговременная доставка.

**Цикл republish.** Цель не должна пересекать подписки потока. Для orders.> цель orders.dash.> отклоняется кодом `10052`; используйте dash.orders.>. Циклы между двумя потоками сервер не всегда обнаруживает.

**Правка не переписывает историю.** Для изменения прежних тем копируйте в новый поток с преобразованием источника.

**Количество разделов нельзя безболезненно менять.** Переход partition(3, …) → partition(4, …) перемещает заказчиков между фильтрами orders.0.>, orders.1.> и другими. Планируйте число заранее.

## Что уже готово {#where-you-are}

Преобразование выполнялось на временном ORDERS-SHARDED, не ORDERS. Если добавлен republish, его убирает `nats stream edit ORDERS --no-republish`. Три места изменения:

- Subject transform при сохранении.
- Republish в живые темы.
- Преобразования источников при [копировании](/learn/jetstream/mirrors-and-sources).

## Что дальше {#whats-next}

[TTL отдельных сообщений](/learn/jetstream/message-ttl) сокращает жизнь выбранной записи.

## См. также {#see-also}

- [Создание потока](/reference/jetstream/api/stream/create) — subject_transform, republish, subject_transforms.
- [ADR-36](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-36.md) — места подключения.
- [ADR-30](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-30.md) — функции шаблона.
- [ADR-28](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-28.md) — заголовки и циклы.
- [Фильтрация](/learn/jetstream/filtering) — без смены тем.
- [Зеркала и источники](/learn/jetstream/mirrors-and-sources) — агрегация.
