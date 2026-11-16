# jetstream {#jetstream}

<Reloadable state="reloadable" note="Applied by replacing the account's whole limits map, so it is all-or-nothing: on a standalone server the update is rejected if it would put max_memory/max_file below already-reserved stream bytes, and the reload still reports success (the error is only logged). Worse, the account walk returns on the first such error, so accounts later in iteration order get no limit update at all." />

## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
| `string` | Указывает, включена ли возможность. | `enabled`, `enable`, `disabled`, `disable` |
| `object` | Объект с набором явно задаваемых свойств. | - |
## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`max_memory`](./max_memory.md) | Максимальный общий объём хранения всех ресурсов в памяти. | `integer` | - | Да\* |
| [`max_file`](./max_file.md) | Максимальный общий объём хранения всех ресурсов с файловым хранением. | `integer` | - | Да\* |
| [`max_streams`](./max_streams.md) | Максимальное допустимое число потоков. | `integer` | - | Да\* |
| [`max_consumers`](./max_consumers.md) | Максимальное допустимое число потребителей. | `integer` | - | Да\* |
| [`max_bytes_required`](./max_bytes_required.md) | Если true, требует явного задания максимального объёма в байтах для всех потоков как с файловым хранением, так и с хранением в памяти. | `boolean` | - | Да\* |
| [`memory_max_stream_bytes`](./memory_max_stream_bytes.md) | Максимальное число байтов, выделяемое одному потоку с хранением в памяти. | `integer` | - | Да\* |
| [`disk_max_stream_bytes`](./disk_max_stream_bytes.md) | Максимальное число байтов, выделяемое одному потоку с файловым хранением. | `integer` | - | Да\* |
| [`max_ack_pending`](./max_ack_pending.md) | Максимальное число неподтверждённых сообщений, которое можно задать для любого потребителя. | `integer` | - | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
