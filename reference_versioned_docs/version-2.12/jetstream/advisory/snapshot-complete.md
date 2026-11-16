# Создание снимка завершено {#snapshot-complete}

Снимок потока создан.

import JSONSchema from '@site/src/components/JSONSchema';
import snapshotComplete from '@site/src/schemas/vendor/v2.12/jsm/jetstream/advisory/v1/snapshot_complete.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.STREAM.SNAPSHOT_COMPLETE.{stream}`

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={snapshotComplete} />
