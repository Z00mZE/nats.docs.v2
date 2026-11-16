# Создание снимка начато {#snapshot-started}

Инициировано создание снимка потока.

import JSONSchema from '@site/src/components/JSONSchema';
import snapshotCreate from '@site/src/schemas/vendor/v2.11/jsm/jetstream/advisory/v1/snapshot_create.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.STREAM.SNAPSHOT_CREATE.{stream}`

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={snapshotCreate} />
