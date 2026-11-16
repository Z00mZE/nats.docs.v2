# Создание потребителя {#create-consumer}

Создание нового потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerCreateRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/consumer_create_request.json';
import consumerCreateResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/consumer_create_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.CREATE.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя (необязательно).

## Запрос {#request}

<JSONSchema schema={consumerCreateRequest} />

## Ответ {#response}

<JSONSchema schema={consumerCreateResponse} />
