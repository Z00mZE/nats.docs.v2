# Группа потребителей закреплена {#consumer-group-pinned}

Группа потребителей закреплена за клиентом.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerGroupPinned from '@site/src/schemas/vendor/v2.15/jsm/jetstream/advisory/v1/consumer_group_pinned.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.PINNED.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={consumerGroupPinned} />
