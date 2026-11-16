# Ответ Info {#info-response}

Ответ с информацией и метаданными сервиса.

import JSONSchema from '@site/src/components/JSONSchema';
import infoResponse from '@site/src/schemas/vendor/v2.12/jsm/micro/v1/info_response.json';

## Тема запроса {#request-subject}

`$SRV.INFO`

Сервисы отвечают на запросы информации в следующих темах:
- `$SRV.INFO.{service}` — информация обо всех экземплярах сервиса
- `$SRV.INFO.{service}.{id}` — информация об определённом экземпляре сервиса

## Схема ответа {#response-schema}

<JSONSchema schema={infoResponse} />
