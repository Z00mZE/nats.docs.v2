# Эвакуация участника {#evacuate-peer}

Перемещение одного потребителя с участника группы. Число реплик потребителя сохраняется, а сервер выбирает замену. Если подходящего участника нет, запрос завершается ошибкой переназначения вместо работы группы с недостаточным числом реплик.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerEvacuatePeerRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/consumer_evacuate_peer_request.json';
import consumerEvacuatePeerResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/consumer_evacuate_peer_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.PEER.EVACUATE.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя.

## Запрос {#request}

<JSONSchema schema={consumerEvacuatePeerRequest} />

## Ответ {#response}

<JSONSchema schema={consumerEvacuatePeerResponse} />
