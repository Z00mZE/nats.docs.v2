# Задержка сервиса {#service-latency}

Метрики задержки сервисов.

import JSONSchema from '@site/src/components/JSONSchema';
import serviceLatency from '@site/src/schemas/vendor/v2.11/jsm/server/metric/v1/service_latency.json';

## Тема подписки {#subscription-subject}

`$SYS.SERVER.METRIC.SERVICE.LATENCY`

## Схема метрики {#metric-schema}

<JSONSchema schema={serviceLatency} />
