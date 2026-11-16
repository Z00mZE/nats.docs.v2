# Сервер удалён {#server-removed}

Сервер удалён из кластера.

import JSONSchema from '@site/src/components/JSONSchema';
import serverRemoved from '@site/src/schemas/vendor/v2.14/jsm/jetstream/advisory/v1/server_removed.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.SERVER.REMOVED`

## Схема события {#event-schema}

<JSONSchema schema={serverRemoved} />
