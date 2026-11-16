# Подтверждение публикации {#publish-acknowledgement}

Прямая публикация сообщения в поток с получением подтверждения.

import JSONSchema from '@site/src/components/JSONSchema';
import pubAckResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/pub_ack_response.json';

## Тема {#subject}


Сообщения публикуются непосредственно в темы, заданные в конфигурации потока.
Подтверждение возвращается в ответ на операцию публикации.

## Схема {#schema}

<JSONSchema schema={pubAckResponse} />
