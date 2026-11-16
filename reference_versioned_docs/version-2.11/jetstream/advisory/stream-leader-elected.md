# Выбран лидер потока {#stream-leader-elected}

Выбран новый лидер потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamLeaderElected from '@site/src/schemas/vendor/v2.11/jsm/jetstream/advisory/v1/stream_leader_elected.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.STREAM.LEADER_ELECTED.{stream}`

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={streamLeaderElected} />
