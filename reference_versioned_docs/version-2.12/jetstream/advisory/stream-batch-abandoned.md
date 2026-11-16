# Атомарный пакет отброшен {#stream-batch-abandoned}

Уведомление, отправляемое при отбрасывании потоком пакета.

import JSONSchema from '@site/src/components/JSONSchema';
import streamBatchAbandoned from '@site/src/schemas/vendor/v2.12/jsm/jetstream/advisory/v1/stream_batch_abandoned.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.STREAM.BATCH_ABANDONED.{stream}`

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={streamBatchAbandoned} />
