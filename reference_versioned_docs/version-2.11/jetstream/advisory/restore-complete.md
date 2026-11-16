# Восстановление завершено {#restore-complete}

Восстановление потока завершено.

import JSONSchema from '@site/src/components/JSONSchema';
import restoreComplete from '@site/src/schemas/vendor/v2.11/jsm/jetstream/advisory/v1/restore_complete.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.STREAM.RESTORE_COMPLETE.{stream}`

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={restoreComplete} />
