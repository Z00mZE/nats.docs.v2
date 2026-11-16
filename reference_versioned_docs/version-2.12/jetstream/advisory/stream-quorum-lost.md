# Потеря кворума потока {#stream-quorum-lost}

Поток потерял кворум.

import JSONSchema from '@site/src/components/JSONSchema';
import streamQuorumLost from '@site/src/schemas/vendor/v2.12/jsm/jetstream/advisory/v1/stream_quorum_lost.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.STREAM.QUORUM_LOST.{stream}`

Где `{stream}` — имя потока.

## Схема события {#event-schema}

<JSONSchema schema={streamQuorumLost} />
