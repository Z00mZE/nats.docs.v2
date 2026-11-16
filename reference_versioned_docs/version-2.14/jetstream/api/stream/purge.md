# Очистка потока {#purge-stream}

Очистка сообщений потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamPurgeRequest from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_purge_request.json';
import streamPurgeResponse from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_purge_response.json';

## Тема {#subject}

`$JS.API.STREAM.PURGE.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamPurgeRequest} />

## Ответ {#response}

<JSONSchema schema={streamPurgeResponse} />
