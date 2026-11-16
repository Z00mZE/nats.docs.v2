# Удаление потока {#delete-stream}

Удаление существующего потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamDeleteResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/stream_delete_response.json';

## Тема {#subject}

`$JS.API.STREAM.DELETE.{stream}`

Где `{stream}` — имя удаляемого потока.

## Ответ {#response}

<JSONSchema schema={streamDeleteResponse} />
