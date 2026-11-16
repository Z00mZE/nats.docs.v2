# max_bytes_required {#max_bytes_required}

<Aliases aliases="max_stream_bytes, max_bytes" />
<Reloadable state="reloadable" note="Applied by replacing the account's whole limits map, so it is all-or-nothing: on a standalone server the update is rejected if it would put max_memory/max_file below already-reserved stream bytes, and the reload still reports success (the error is only logged). Worse, the account walk returns on the first such error, so accounts later in iteration order get no limit update at all. Enforced when assets are created or updated; existing streams/consumers above the new value are left running." />
Если true, требует явного задания максимального объёма в байтах для всех потоков как с файловым хранением, так и с хранением в памяти.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
