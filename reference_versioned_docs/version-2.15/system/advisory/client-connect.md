# Подключение клиента {#client-connect}

События подключения клиентов.

import JSONSchema from '@site/src/components/JSONSchema';
import clientConnect from '@site/src/schemas/vendor/v2.15/jsm/server/advisory/v1/client_connect.json';

## Тема подписки {#subscription-subject}

`$SYS.ACCOUNT.{account}.CONNECT`

Где `{account}` — имя учётной записи.

## Схема события {#event-schema}

<JSONSchema schema={clientConnect} />
