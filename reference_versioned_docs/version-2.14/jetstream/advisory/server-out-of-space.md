# На сервере нет места {#server-out-of-space}

Хранилище сервера исчерпано.

import JSONSchema from '@site/src/components/JSONSchema';
import serverOutOfSpace from '@site/src/schemas/vendor/v2.14/jsm/jetstream/advisory/v1/server_out_of_space.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.SERVER.OUT_OF_STORAGE`

## Схема события {#event-schema}

<JSONSchema schema={serverOutOfSpace} />
