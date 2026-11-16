# Эвакуация сервера {#server-evacuate}

Перемещение всех потоков и потребителей с сервера для его вывода из кластера. Число реплик каждого ресурса сохраняется, а сервер выбирает новых участников. Замена выполняется по возможности: ресурс без подходящего участника всё равно переносится с сервера и работает с недостаточным числом реплик до появления замены. Эвакуируемый сервер исключается из размещения этих ресурсов, чтобы они не вернулись на него сразу.

import JSONSchema from '@site/src/components/JSONSchema';
import metaServerEvacuateRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/meta_server_evacuate_request.json';
import metaServerEvacuateResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/meta_server_evacuate_response.json';

## Тема {#subject}

`$JS.API.SERVER.EVACUATE`

Работает только из системной учётной записи.

## Запрос {#request}

<JSONSchema schema={metaServerEvacuateRequest} />

## Ответ {#response}

<JSONSchema schema={metaServerEvacuateResponse} />
