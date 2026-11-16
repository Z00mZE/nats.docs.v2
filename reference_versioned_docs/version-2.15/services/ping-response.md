# Ответ Ping {#ping-response}

Ответ проверки работоспособности сервиса.

import JSONSchema from '@site/src/components/JSONSchema';
import pingResponse from '@site/src/schemas/vendor/v2.15/jsm/micro/v1/ping_response.json';

## Тема запроса {#request-subject}

`$SRV.PING`

Сервисы отвечают на запросы ping в следующих темах:
- `$SRV.PING.{service}` — проверка всех экземпляров сервиса
- `$SRV.PING.{service}.{id}` — проверка определённого экземпляра сервиса

## Схема ответа {#response-schema}

<JSONSchema schema={pingResponse} />
