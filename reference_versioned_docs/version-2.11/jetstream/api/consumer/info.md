# Информация о потребителе {#consumer-info}

Получение информации о потребителе.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerInfoResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_info_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.INFO.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя.

## Ответ {#response}

<JSONSchema schema={consumerInfoResponse} />
