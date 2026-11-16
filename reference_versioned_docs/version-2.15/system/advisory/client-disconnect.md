# Отключение клиента {#client-disconnect}

События отключения клиентов.

import JSONSchema from '@site/src/components/JSONSchema';
import clientDisconnect from '@site/src/schemas/vendor/v2.15/jsm/server/advisory/v1/client_disconnect.json';

## Тема подписки {#subscription-subject}

`$SYS.ACCOUNT.{account}.DISCONNECT`

Где `{account}` — имя учётной записи.

## Схема события {#event-schema}

<JSONSchema schema={clientDisconnect} />
