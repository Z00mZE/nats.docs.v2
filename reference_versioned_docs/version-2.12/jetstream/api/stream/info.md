# Информация о потоке {#stream-info}

Получение информации о потоке.

import JSONSchema from '@site/src/components/JSONSchema';
import streamInfoRequest from '@site/src/schemas/vendor/v2.12/jsm/jetstream/api/v1/stream_info_request.json';
import streamInfoResponse from '@site/src/schemas/vendor/v2.12/jsm/jetstream/api/v1/stream_info_response.json';

## Тема {#subject}

`$JS.API.STREAM.INFO.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamInfoRequest} />

## Ответ {#response}

<JSONSchema schema={streamInfoResponse} />
