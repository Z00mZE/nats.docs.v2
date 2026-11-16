# Отмена перемещения {#cancel-move}

Отмена текущего изменения конфигурации потока и возврат к конфигурации и участникам, использовавшимся до его начала. Это относится к любому незавершённому желаемому состоянию, а не только к перемещению: увеличение или уменьшение числа реплик и изменение политики хранения отменяются так же.

import JSONSchema from '@site/src/components/JSONSchema';
import streamCancelMoveResponse from '@site/src/schemas/vendor/v2.15/jsm/jetstream/api/v1/stream_cancel_move_response.json';

## Тема {#subject}

- `$JS.API.STREAM.CANCEL_MOVE.{stream}`
- `$JS.API.ACCOUNT.STREAM.CANCEL_MOVE.{account}.{stream}`

Где `{stream}` — имя потока, а `{account}` — содержащая его учётная запись.

Первая тема используется из учётной записи, которой принадлежит поток. Вторая отменяет перемещение от имени другой учётной записи и доступна только из системной учётной записи.

## Ответ {#response}

<JSONSchema schema={streamCancelMoveResponse} />
