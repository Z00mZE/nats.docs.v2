# Удаление сервера {#server-remove}

Удаление сервера из кластера JetStream.

import JSONSchema from '@site/src/components/JSONSchema';
import metaServerRemoveRequest from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/meta_server_remove_request.json';
import metaServerRemoveResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/meta_server_remove_response.json';

## Тема {#subject}

`$JS.API.SERVER.REMOVE`

## Запрос {#request}

<JSONSchema schema={metaServerRemoveRequest} />

## Ответ {#response}

<JSONSchema schema={metaServerRemoveResponse} />
