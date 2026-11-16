# Отрицательное подтверждение сообщения {#message-negative-acknowledgement}

Получено отрицательное подтверждение сообщения.

import JSONSchema from '@site/src/components/JSONSchema';
import nak from '@site/src/schemas/vendor/v2.14/jsm/jetstream/advisory/v1/nak.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.CONSUMER.MSG_NAKED.{stream}.{consumer}`

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={nak} />
