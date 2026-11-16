# Обновление потока {#update-stream}

Обновление конфигурации существующего потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamUpdateRequest from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_update_request.json';
import streamUpdateResponse from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_update_response.json';

## Тема {#subject}

`$JS.API.STREAM.UPDATE.{stream}`

Где `{stream}` — имя обновляемого потока.

## Запрос {#request}

<JSONSchema schema={streamUpdateRequest} />

## Ответ {#response}

<JSONSchema schema={streamUpdateResponse} />
