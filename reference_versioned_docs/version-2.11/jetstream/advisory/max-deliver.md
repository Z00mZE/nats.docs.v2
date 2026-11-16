# Превышен лимит доставок {#max-deliveries-exceeded}

Сообщение превысило максимальное число попыток доставки.

import JSONSchema from '@site/src/components/JSONSchema';
import maxDeliver from '@site/src/schemas/vendor/v2.11/jsm/jetstream/advisory/v1/max_deliver.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.MAX_DELIVERIES.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={maxDeliver} />
