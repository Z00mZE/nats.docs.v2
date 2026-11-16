# Аварийное восстановление метаданных {#meta-rescue}

Уменьшение кворума группы метаданных для удаления участников, когда слишком много серверов потеряно безвозвратно. Операция небезопасна и предназначена только для аварийного восстановления.

import JSONSchema from '@site/src/components/JSONSchema';
import metaRescueRequest from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/meta_rescue_request.json';
import metaRescueResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/meta_rescue_response.json';

## Тема {#subject}

`$JS.API.META.RESCUE`

Работает только из системной учётной записи. Это широковещательная тема: каждый доступный сервер самостоятельно оценивает запрос и отвечает, поэтому ожидается по одному ответу от сервера, а не один общий ответ.

## Запрос {#request}

<JSONSchema schema={metaRescueRequest} />

## Ответ {#response}

<JSONSchema schema={metaRescueResponse} />
