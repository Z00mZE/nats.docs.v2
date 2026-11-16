---
id: mirrors-and-sources
title: "Зеркала и источники"
sidebar_position: 18
description: "Копирование одного потока или объединение нескольких"
---

# Зеркала и источники {#mirrors-and-sources}

Пока пример использовал один ORDERS.

**Зеркало** — копия одного потока только для чтения. **Источники** объединяют несколько потоков.

Поведение определено в [ADR-59](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-59.md), нормативном описании зеркал и источников.

## Зеркало {#what-a-mirror-is}

Оно непрерывно копирует каждое сообщение одного источника.

<div class="nats-flow" data-scenario="mirrorCopyAnimated" data-width="680" data-height="250"></div>

Сохраняются номер, время и тема: orders.created с номером 1 остаётся номером 1.

Собственных тем нет, прямые публикации невозможны: они попадают в исходный поток, владеющий темой.

У зеркала свои ограничения: источник может хранить семь дней, зеркало — бессрочно.

Конфигурация фиксируется при создании. Для смены источника или фильтра пересоздайте зеркало; оно само догонит, пока данные есть у источника.

## Источники {#what-sources-are}

Поток с **sources** одновременно собирает несколько исходных.

ORDERS-US, ORDERS-EU и ORDERS-APAC становятся общим ALL-ORDERS.

<div class="nats-flow" data-scenario="sourcesMergeAnimated" data-width="680" data-height="280"></div>

Порядок каждого источника сохраняется, общий между источниками не гарантирован. Номера назначаются новые по поступлению.

Такой поток может иметь собственные темы и принимать прямые публикации вместе с собранным.

Источники и фильтры можно добавлять, удалять и менять без пересоздания.

## Выбор {#mirror-or-source}

Зеркало точно копирует один, источники объединяют несколько.

| | Зеркало | Источники |
| --- | --- | --- |
| Исходные потоки | один | один или несколько |
| Номера | исходные | новые по поступлению |
| Прямые публикации | нет | возможны |
| Изменение | пересоздание | обновление источников |

**Зеркало** подходит копии рядом с удалёнными читателями, переживанию отказа исходного кластера и длительному архиву.

**Источники** — региональной или межарендаторской отчётности и производным представлениям.

## Создание {#build-them}

### Зеркало ORDERS-ARCHIVE {#build-the-orders-archive-mirror}

Создайте бессрочную копию ORDERS:

<div class="nats-example"
     data-type="learn-jetstream-mirrors-and-sources-createMirror"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

`--mirror ORDERS` задаёт зеркало без `--subjects`. CLI поддерживает простой вариант; фильтры и преобразования задаются JSON-конфигурацией из справочника.

Вскоре копия догонит исходные три заказа. В информации появится раздел:

```
Mirror Information:

          Stream Name: ORDERS
                  Lag: 0
            Last Seen: 1.20s
```

**Stream Name** — источник, **Lag** — отставание сообщений, **Last Seen** — время последнего сообщения или сигнала. Нулевой Lag и небольшой стабильный Last Seen означают исправную связь.

Добавьте четвёртый заказ и запросите `nats stream info
ORDERS-ARCHIVE`: зеркало само получит его без вашего потребителя и кода, Lag вернётся к 0.

### Агрегат ALL-ORDERS {#build-the-all-orders-source}

Создайте три региональных потока с отдельными темами, затем общий:

<div class="nats-example"
     data-type="learn-jetstream-mirrors-and-sources-createSource"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Собственных subjects здесь нет, только sources. Source Information содержит блок каждого:

```
Source Information:

          Stream Name: ORDERS-US
                  Lag: 0
            Last Seen: 1.20s

          Stream Name: ORDERS-EU
                  Lag: 0
            Last Seen: 1.20s

          Stream Name: ORDERS-APAC
                  Lag: 0
            Last Seen: 1.20s
```

У каждого свой Lag и Last Seen. Данные перемешиваются по поступлению; регионы можно менять обновлением конфигурации.

## Фильтры, преобразования и доступ {#filters-transforms-and-reach}

Дополнительные поля позволяют выбрать часть тем, переименовать их или достичь другой учётной записи либо домена JetStream.

`filter_subject`, `subject_transforms`, `opt_start_seq`, `external` и остальные поля — в [Конфигурации потока](/reference/jetstream/api/stream/create). Здесь простые mirror и source.

Для другого домена или записи нужны темы API потребителя, доставки и управления потоком с правильными типами экспорта. Ошибки разобраны ниже, конфигурация — в [Межаккаунтных темах](/reference/jetstream/cross-account-subjects).

Переключение на зеркало при аварии — [Резервное копирование и восстановление](/learn/backup-recovery/mirrors-and-sources).

## Типичные ошибки {#pitfalls}

Несколько важных правил:

**Публикация в зеркало.** orders.shipped принадлежит ORDERS и попадёт туда, не в ARCHIVE. Перенаправление темы или домена может привести к отказу. `Nats-Expected-Stream: ORDERS-ARCHIVE` даёт `expected stream does not match`, код `10060`. Публикуйте в источник и ждите копирования.

<div class="nats-example"
     data-type="learn-jetstream-mirrors-and-sources-publishToMirror"
     data-languages="cli"></div>

**Предположение о мгновенной копии.** Зеркало согласуется со временем: при всплеске Lag растёт. Проверяйте его, а устойчиво высокий считайте проблемой производительности.

<div class="nats-example"
     data-type="learn-jetstream-mirrors-and-sources-mirrorLag"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

**Одновременно фильтр и преобразование.** В одной записи разрешено filter_subject *или* subject_transforms. Последнее уже умеет отбирать и переименовывать. Вместе сервер отклоняет.

**Неверные типы междоменных экспортов.** Нужны external и согласованные импорты/экспорты: API потребителя и управление потоком — *service*, доставка — *stream*. Ошибка может не дать явного отказа: зеркало просто не догоняет. Сверяйте [Межаккаунтные темы](/reference/jetstream/cross-account-subjects) и авторизацию.

## Что уже готово {#where-you-are}

Теперь есть:

- Прежний ORDERS.
- Точная копия только для чтения ORDERS-ARCHIVE.
- ALL-ORDERS из трёх регионов.

## Что дальше {#whats-next}

Далее — [прямое чтение](/learn/jetstream/get-direct) без потребителя с любой реплики или зеркала, [сопоставление тем](/learn/jetstream/subject-mapping), [TTL](/learn/jetstream/message-ttl), [политики](/learn/jetstream/policies) и [итоги](/learn/jetstream/where-next).

## См. также {#see-also}

- [ADR-59](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-59.md) — спецификация.
- [Конфигурация потока](/reference/jetstream/api/stream/create) — все поля.
- [Межаккаунтные темы](/reference/jetstream/cross-account-subjects) — форматы, типы и права листов.
- [Резервное копирование](/learn/backup-recovery/mirrors-and-sources) — аварийное применение.
