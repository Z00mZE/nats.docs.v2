# Достигнут лимит API {#api-limit-reached}

События достижения лимита очереди запросов API.

import JSONSchema from '@site/src/components/JSONSchema';
import apiLimitReached from '@site/src/schemas/vendor/v2.11/jsm/jetstream/advisory/v1/api_limit_reached.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.API.LIMIT_REACHED`

В теме нет сегмента учётной записи. Сервер публикует уведомление в системной учётной записи, а поле `server` указывает сервер, достигший лимита.

## Схема события {#event-schema}

<JSONSchema schema={apiLimitReached} />
