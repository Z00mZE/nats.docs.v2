# Получение следующего сообщения {#get-next-message}

Получение следующего сообщения или нескольких сообщений от потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerGetnextRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/consumer_getnext_request.json';

## Тема {#subject}

`$JS.API.CONSUMER.MSG.NEXT.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя.

## Запрос {#request}

<JSONSchema schema={consumerGetnextRequest} />
