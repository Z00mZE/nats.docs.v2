# Приостановка потребителя {#consumer-pause}

Потребитель приостановлен или возобновлён.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerPause from '@site/src/schemas/vendor/v2.11/jsm/jetstream/advisory/v1/consumer_pause.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.PAUSE.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={consumerPause} />
