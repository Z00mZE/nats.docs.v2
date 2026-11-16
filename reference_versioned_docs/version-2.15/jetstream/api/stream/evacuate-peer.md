# Эвакуация участника {#evacuate-peer}

Перемещение потока и его потребителей с одного участника. Число реплик потока сохраняется, а сервер выбирает замену. Если ограничения размещения потока не позволяют выбрать участника, запрос завершается ошибкой переназначения вместо работы группы с недостаточным числом реплик.

import JSONSchema from '@site/src/components/JSONSchema';
import streamEvacuatePeerRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_evacuate_peer_request.json';
import streamEvacuatePeerResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_evacuate_peer_response.json';

## Тема {#subject}

`$JS.API.STREAM.PEER.EVACUATE.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamEvacuatePeerRequest} />

## Ответ {#response}

<JSONSchema schema={streamEvacuatePeerResponse} />
