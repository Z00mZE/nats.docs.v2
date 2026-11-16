# Удаление участника {#remove-peer}

Удаление участника из группы репликации потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamRemovePeerRequest from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_remove_peer_request.json';
import streamRemovePeerResponse from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_remove_peer_response.json';

## Тема {#subject}

`$JS.API.STREAM.PEER.REMOVE.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamRemovePeerRequest} />

## Ответ {#response}

<JSONSchema schema={streamRemovePeerResponse} />
