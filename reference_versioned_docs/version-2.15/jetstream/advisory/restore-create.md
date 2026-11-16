# Восстановление начато {#restore-started}

Инициировано восстановление потока.

import JSONSchema from '@site/src/components/JSONSchema';
import restoreCreate from '@site/src/schemas/vendor/v2.15/jsm/jetstream/advisory/v1/restore_create.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.STREAM.RESTORE_CREATE.{stream}`

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={restoreCreate} />
