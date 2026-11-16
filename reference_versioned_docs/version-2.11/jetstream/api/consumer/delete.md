# Удаление потребителя {#delete-consumer}

Удаление потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerDeleteResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_delete_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.DELETE.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя.

## Ответ {#response}

<JSONSchema schema={consumerDeleteResponse} />
