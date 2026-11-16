# Восстановление потока {#restore-stream}

Восстановление потока из снимка.

import JSONSchema from '@site/src/components/JSONSchema';
import streamRestoreRequest from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/stream_restore_request.json';
import streamRestoreResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/stream_restore_response.json';

## Тема {#subject}

`$JS.API.STREAM.RESTORE.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamRestoreRequest} />

## Ответ {#response}

<JSONSchema schema={streamRestoreResponse} />
