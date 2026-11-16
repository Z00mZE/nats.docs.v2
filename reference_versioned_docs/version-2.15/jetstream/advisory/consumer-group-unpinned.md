# Группа потребителей откреплена {#consumer-group-unpinned}

Группа потребителей откреплена от клиента.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerGroupUnpinned from '@site/src/schemas/vendor/v2.15/jsm/jetstream/advisory/v1/consumer_group_unpinned.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.UNPINNED.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={consumerGroupUnpinned} />
