# Доставка сообщения прекращена {#message-terminated}

Доставка сообщения прекращена.

import JSONSchema from '@site/src/components/JSONSchema';
import terminated from '@site/src/schemas/vendor/v2.14/jsm/jetstream/advisory/v1/terminated.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.MSG_TERMINATED.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={terminated} />
