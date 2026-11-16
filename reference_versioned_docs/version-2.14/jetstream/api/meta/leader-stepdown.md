# Сложение полномочий лидера метаданных {#meta-leader-stepdown}

Запуск сложения полномочий лидера группы метаданных.

import JSONSchema from '@site/src/components/JSONSchema';
import metaLeaderStepdownRequest from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/meta_leader_stepdown_request.json';
import metaLeaderStepdownResponse from '@site/src/schemas/vendor/v2.14/jsm/jetstream/api/v1/meta_leader_stepdown_response.json';

## Тема {#subject}

`$JS.API.META.LEADER.STEPDOWN`

## Запрос {#request}

<JSONSchema schema={metaLeaderStepdownRequest} />

## Ответ {#response}

<JSONSchema schema={metaLeaderStepdownResponse} />
