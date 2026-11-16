# Приостановка потребителя {#pause-consumer}

Приостановка или возобновление потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerPauseRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/consumer_pause_request.json';
import consumerPauseResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/consumer_pause_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.PAUSE.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя.

## Запрос {#request}

<JSONSchema schema={consumerPauseRequest} />

## Ответ {#response}

<JSONSchema schema={consumerPauseResponse} />
