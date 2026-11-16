# Соединения учётной записи {#account-connections}

События лимитов соединений учётной записи.

import JSONSchema from '@site/src/components/JSONSchema';
import accountConnections from '@site/src/schemas/vendor/v2.11/jsm/server/advisory/v1/account_connections.json';

## Тема подписки {#subscription-subject}

`$SYS.ACCOUNT.{account}.CONNECTIONS`

Где `{account}` — имя учётной записи.

## Схема события {#event-schema}

<JSONSchema schema={accountConnections} />
