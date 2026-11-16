# Метрика подтверждения потребителя {#consumer-acknowledgement-metric}

Метрики подтверждения потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerAck from '@site/src/schemas/vendor/v2.12/jsm/jetstream/metric/v1/consumer_ack.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.METRIC.CONSUMER.ACK.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={consumerAck} />
