# Список потребителей {#list-consumers}

Получение списка потребителей потока.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerListRequest from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_list_request.json';
import consumerListResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_list_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.LIST.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={consumerListRequest} />

## Ответ {#response}

<JSONSchema schema={consumerListResponse} />
