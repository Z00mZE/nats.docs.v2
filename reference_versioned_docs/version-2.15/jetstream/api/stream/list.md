# Список потоков {#list-streams}

Получение списка всех потоков.

import JSONSchema from '@site/src/components/JSONSchema';
import streamListRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_list_request.json';
import streamListResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_list_response.json';

## Тема {#subject}

`$JS.API.STREAM.LIST`

## Запрос {#request}

<JSONSchema schema={streamListRequest} />

## Ответ {#response}

<JSONSchema schema={streamListResponse} />
