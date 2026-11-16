---
id: advanced-publishing
title: "Расширенная публикация"
sidebar_position: 17
description: "Асинхронный, атомарный пакетный и скоростной режимы: назначение, порядок и примеры"
---

# Расширенная публикация {#advanced-publishing}

Одиночная [публикация](/learn/jetstream/publishing) с ожиданием PubAck подходит большинству сервисов. Иные режимы нужны высокой частоте или группе сообщений, имеющих смысл только вместе.

Разберём три режима, назначение и цену. ORDERS прежний, выбор делает издатель.

## Асинхронная публикация {#async-publish}

Синхронная тысяча сообщений ждёт тысячу последовательных обменов. **Асинхронная** запускает отправки без ожидания, собирая подтверждения позже; обмены перекрываются.

Гарантии прежние: PubAck каждого и хранение не менее одного раза. Проверять нужно все ответы, но позже.

### Ловушка порядка {#the-order-trap}

Повторы создают особый риск.

Сервер нумерует по поступлению. Для 1–6 подтверждение 3 может потеряться или завершиться тайм-аутом, пока 4–6 уже успешны.

Если 3 не сохранился, повтор придёт после 4–6 и получит больший номер.

<div class="nats-flow" data-scenario="asyncOrderingAnimated" data-width="840" data-height="380"></div>

Решения разных проблем:

- При потере лишь ответа стабильный `Nats-Msg-Id` подавляет вторую копию; см. [дедупликацию](/learn/jetstream/publishing#avoiding-duplicate-writes).
- При важном порядке `Nats-Expected-Last-Subject-Sequence` разрешает запись лишь при ожидаемом последнем номере темы. Опоздавший повтор отклоняется явно вместо неверного места; обработайте отказ.

**Непроверенная асинхронная запись не имеет гарантии.** Собирайте и проверяйте каждый ack.

Это возможность библиотеки, не настройка потока. Примеры запускают отправки и затем ждут все ответы:

<div class="nats-example"
     data-type="learn-jetstream-advanced-publishing-async"
     data-languages="js,go,python,java,rust,csharp,c"></div>

Go, Java, .NET, Rust возвращают future специальным вызовом. nats.js собирает promises без ожидания каждого `publish()`. nats.py использует `asyncio.gather` с вашим ограничением параллелизма. Обычный CLI pub синхронен, async есть в `nats bench js pub async orders.created --batch 1000`.

## Атомарная пакетная публикация {#atomic-batch-publish}

**Атомарный пакет** сохраняется весь либо никак. Например, позиции одного заказа не должны записаться частично.

<div class="nats-flow" data-scenario="atomicBatchAnimated" data-width="780" data-height="320"></div>

Потоку нужен `AllowAtomicPublish`. Клиент задаёт `Nats-Batch-Id`, возрастающий `Nats-Batch-Sequence` и последний `Nats-Batch-Commit`. До commit сервер держит промежуточный буфер. Итоговый PubAck содержит `batch` и `count`.

По умолчанию максимум 1000 сообщений и 50 активных пакетов на поток; это настраиваемые серверные пределы. Разрыв номеров или превышение даёт ошибочный PubAck. После десяти секунд без сообщений пакет удаляется без ответа об ошибке, с уведомлением stream_batch_abandoned. Только итоговый PubAck доказывает фиксацию. Требуется сервер 2.12+.

Включите возможность, откройте пакет, передайте данные и зафиксируйте. CLI и nats.js поддерживают напрямую, Go, Java, Rust, .NET — через [Synadia Orbit](https://github.com/synadia-io), Python — заголовками Nats-Batch-*. Примеры сохраняют три позиции:

<div class="nats-example"
     data-type="learn-jetstream-advanced-publishing-atomic"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Протокол заголовков одинаков, поэтому обёртка Orbit необязательна. Поля и пределы — в [ADR-50](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-50.md).

## Скоростная пакетная публикация {#fast-ingest-batch-publish}

**Fast-ingest** заменяет угадывание скорости асинхронных отправок серверным управлением потоком. Один канал, пакетные подтверждения и регулировка темпа балансируют многих быстрых издателей.

<div class="nats-flow" data-scenario="fastIngestAnimated" data-width="760" data-height="300"></div>

Атомарности нет, пакет может быть неограниченным. Для пропусков два режима:

- **`gap: fail`** прекращает пакет на первом разрыве, оставляя последовательную записанную часть. Подходит фрагментам объекта.
- **`gap: ok`** сообщает пропуск и продолжает, например для метрик.

Нужны `AllowBatchPublish` и сервер 2.14+. Поддержка клиентов развивается:

| Клиент | Fast-ingest |
| --- | --- |
| CLI | `nats bench js pub fast`, только тест скорости |
| Go | Synadia Orbit — `jetstreamext.NewFastPublisher` |
| Rust | Synadia Orbit — `fast_publish` из `jetstream_extra` |
| nats.js | Synadia Orbit — `@synadiaorbit/fastingest`, `startFastIngest` |
| Python, Java, .NET | Флаг `AllowBatchPublish`; издатели Orbit ещё развиваются |

Из-за отсутствия стабильного общедоступного издателя большинства клиентов примеров по языкам нет. Практические варианты — Orbit для Go, Rust, JavaScript. Протокол — в [ADR-50](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-50.md).

## Выбор режима {#choosing-a-mode}

Стандарт — одиночный PubAck. Другой режим нужен при конкретной причине:

| Режим | Когда | Всё или ничего | Включение |
| --- | --- | --- | --- |
| По одному | Просто, упорядоченно, безопасно повторять | неприменимо | не нужно |
| Асинхронно | Высокая частота, одиночные слишком медленны | нет | не нужно |
| Атомарный пакет | Все записи обязаны сохраниться вместе | да | `AllowAtomicPublish` |
| Fast-ingest | Максимальная скорость с допустимыми пропусками или остановкой на них | нет | `AllowBatchPublish` |

## Типичные ошибки {#pitfalls}

Отличия от обычной публикации:

**Не проверять async-ответы.** Проверяйте каждый PubAck; для порядка добавляйте `Nats-Expected-Last-Subject-Sequence`.

**Пакет может быть брошен.** Разрыв или превышение 1000 даёт ошибку, десять секунд тишины — только уведомление. Частичный пакет не фиксируется; доказательство — финальный PubAck.

**Атомарность несовместима с `PersistMode: async`.** Нужен синхронный путь хранения. Fast-ingest на таком потоке допустим.

**`gap: ok` допускает потерю.** Для непотеряемых данных выбирайте fail или атомарный пакет.

## Что уже готово {#where-you-are}

ORDERS не изменился. Освоены:

- Async с перекрытием обменов, проверкой ack и вниманием к порядку.
- Атомарные группы с AllowAtomicPublish.
- Управляемый сервером fast-ingest с AllowBatchPublish.

[Одиночная публикация](/learn/jetstream/publishing) остаётся достаточной большинству.

## Что дальше {#whats-next}

Копирование данных: зеркала и источники для чтения рядом, агрегации и аварийного восстановления.

## См. также {#see-also}

- [ADR-50](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-50.md) — протоколы и пределы.
- [Создание потока](/reference/jetstream/api/stream/create) — `allow_atomic`, `allow_batched`.
- [Заголовки](/reference/jetstream/api/headers) — ожидаемый номер и пакеты.
- [PubAck](/reference/jetstream/api/stream/pub-ack) — batch и count.
