# Сложение полномочий лидера {#leader-stepdown}

Запуск сложения полномочий лидера потока.

import JSONSchema from '@site/src/components/JSONSchema';
import streamLeaderStepdownRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_leader_stepdown_request.json';
import streamLeaderStepdownResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_leader_stepdown_response.json';

## Тема {#subject}

`$JS.API.STREAM.LEADER.STEPDOWN.{stream}`

Где `{stream}` — имя потока.

## Запрос {#request}

<JSONSchema schema={streamLeaderStepdownRequest} />

## Ответ {#response}

<JSONSchema schema={streamLeaderStepdownResponse} />
