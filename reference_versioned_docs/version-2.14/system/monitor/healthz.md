# Healthz {#healthz}

import JSONSchema from '@site/src/components/JSONSchema';
import healthzRequest from '@site/src/schemas/vendor/v2.14/server/monitor/v1/healthz_request.json';
import healthzResponse from '@site/src/schemas/vendor/v2.14/server/monitor/v1/healthz_response.json';

## Схема запроса {#request-schema}

<JSONSchema schema={healthzRequest} />

## Схема ответа {#response-schema}

<JSONSchema schema={healthzResponse} />
