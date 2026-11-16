# Ответ Stats {#stats-response}

Ответ со статистикой и метриками сервиса.

import JSONSchema from '@site/src/components/JSONSchema';
import statsResponse from '@site/src/schemas/vendor/v2.14/jsm/micro/v1/stats_response.json';

## Тема запроса {#request-subject}

`$SRV.STATS`

Сервисы отвечают на запросы статистики в следующих темах:
- `$SRV.STATS.{service}` — статистика всех экземпляров сервиса
- `$SRV.STATS.{service}.{id}` — статистика определённого экземпляра сервиса

## Схема ответа {#response-schema}

<JSONSchema schema={statsResponse} />
