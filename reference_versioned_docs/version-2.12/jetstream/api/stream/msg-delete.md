# Удаление сообщения {#delete-message}

Удаление определённого сообщения из потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamMsgDeleteRequest from '@site/src/schemas/vendor/v2.12/jsm/jetstream/api/v1/stream_msg_delete_request.json';
import streamMsgDeleteResponse from '@site/src/schemas/vendor/v2.12/jsm/jetstream/api/v1/stream_msg_delete_response.json';

## Тема {#subject}

`$JS.API.STREAM.MSG.DELETE.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamMsgDeleteRequest} />

## Ответ {#response}

<JSONSchema schema={streamMsgDeleteResponse} />
