# Сложение полномочий лидера {#leader-stepdown}

Запуск сложения полномочий лидера потребителя.

import JSONSchema from '@site/src/components/JSONSchema';
import consumerLeaderStepdownRequest from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_leader_stepdown_request.json';
import consumerLeaderStepdownResponse from '@site/src/schemas/vendor/v2.11/jsm/jetstream/api/v1/consumer_leader_stepdown_response.json';

## Тема {#subject}

`$JS.API.CONSUMER.LEADER.STEPDOWN.{stream}.{consumer}`

Где `{stream}` — имя потока, а `{consumer}` — имя потребителя.

## Запрос {#request}

<JSONSchema schema={consumerLeaderStepdownRequest} />

## Ответ {#response}

<JSONSchema schema={consumerLeaderStepdownResponse} />
