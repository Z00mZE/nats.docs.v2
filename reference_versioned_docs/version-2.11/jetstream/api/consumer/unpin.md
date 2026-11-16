# Открепление потребителя {#unpin-consumer}

Открепление группы потребителей.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerUnpinRequest from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_unpin_request.json';
import consumerUnpinResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_unpin_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.UNPIN.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя.

## Запрос {#request}

<JSONSchema schema={consumerUnpinRequest} />

## Ответ {#response}

<JSONSchema schema={consumerUnpinResponse} />
