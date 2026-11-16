# Действие с потоком {#stream-action}

События жизненного цикла потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamAction from '@site/src/schemas/vendor/v2.15/jsm/jetstream/advisory/v1/stream_action.json';

## Тема подписки {#subscription-subject}

```
$JS.EVENT.ADVISORY.STREAM.CREATED.{stream}
$JS.EVENT.ADVISORY.STREAM.DELETED.{stream}
$JS.EVENT.ADVISORY.STREAM.UPDATED.{stream}
```

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={streamAction} />
