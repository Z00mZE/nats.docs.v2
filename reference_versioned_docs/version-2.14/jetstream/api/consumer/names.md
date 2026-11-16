# Имена потребителей {#consumer-names}

Получение списка имён потребителей потока.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerNamesRequest from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/consumer_names_request.json';
import consumerNamesResponse from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/consumer_names_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.NAMES.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={consumerNamesRequest} />

## Ответ {#response}

<JSONSchema schema={consumerNamesResponse} />
