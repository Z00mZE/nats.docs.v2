# Получение сообщения {#get-message}

Получение определённого сообщения из потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamMsgGetRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_msg_get_request.json';
import streamMsgGetResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_msg_get_response.json';

## Тема {#subject}

`$JS.API.STREAM.MSG.GET.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamMsgGetRequest} />

## Ответ {#response}

<JSONSchema schema={streamMsgGetResponse} />
