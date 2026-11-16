# Потеря кворума потребителя {#consumer-quorum-lost}

Потребитель потерял кворум.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerQuorumLost from '@site/src/schemas/vendor/v2.15/jsm/jetstream/advisory/v1/consumer_quorum_lost.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.QUORUM_LOST.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={consumerQuorumLost} />
