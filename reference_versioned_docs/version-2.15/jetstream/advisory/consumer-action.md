# Действие с потребителем {#consumer-action}

События жизненного цикла потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerAction from '@site/src/schemas/vendor/v2.15/jsm/jetstream/advisory/v1/consumer_action.json';

## Тема подписки {#subscription-subject}

```
$JS.EVENT.ADVISORY.CONSUMER.CREATED.{stream}.{consumer}
$JS.EVENT.ADVISORY.CONSUMER.DELETED.{stream}.{consumer}
```

Где:
- `{stream}` — имя потока
- `{consumer}` — имя потребителя

## Схема события {#event-schema}

<JSONSchema schema={consumerAction} />
