# Выбран лидер домена {#domain-leader-elected}

Выбран новый лидер домена.

import JSONSchema from '@site/src/components/JSONSchema';
import domainLeaderElected from '@site/src/schemas/vendor/v2.12/jsm/jetstream/advisory/v1/domain_leader_elected.json';

## Тема подписки {#subscription-subject}

`$JS.EVENT.ADVISORY.DOMAIN.LEADER_ELECTED`

В теме нет сегмента домена. Если домен настроен, его имя появляется в поле события `domain`; в противном случае поле отсутствует.

## Схема события {#event-schema}

<JSONSchema schema={domainLeaderElected} />
