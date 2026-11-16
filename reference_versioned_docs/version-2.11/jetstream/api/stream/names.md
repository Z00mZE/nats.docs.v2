# Имена потоков {#stream-names}

Получение списка имён потоков.

import JSONSchema from '@site/src/components/JSONSchema';
import streamNamesRequest from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/stream_names_request.json';
import streamNamesResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/stream_names_response.json';

## Тема {#subject}

`$JS.API.STREAM.NAMES`

## Запрос {#request}

<JSONSchema schema={streamNamesRequest} />

## Ответ {#response}

<JSONSchema schema={streamNamesResponse} />
