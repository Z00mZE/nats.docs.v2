# Создание потока {#create-stream}

Создание нового потока с указанной конфигурацией.

import JSONSchema from '@site/src/components/JSONSchema';
import streamCreateRequest from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_create_request.json';
import streamCreateResponse from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/stream_create_response.json';

## Тема {#subject}

`$JS.API.STREAM.CREATE.{stream}`

Где `{stream}` — имя создаваемого потока.

## Запрос {#request}

<JSONSchema schema={streamCreateRequest} />

## Ответ {#response}

<JSONSchema schema={streamCreateResponse} />
