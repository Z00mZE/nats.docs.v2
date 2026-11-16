# Выбран лидер потребителя {#consumer-leader-elected}

Выбран новый лидер потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerLeaderElected from '@site/src/schemas/vendor/v2.14/jsm/jetstream/advisory/v1/consumer_leader_elected.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.LEADER_ELECTED.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={consumerLeaderElected} />
