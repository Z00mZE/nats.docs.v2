# type {#type}

<Reloadable state="reloadable" note="Handled as part of the whole `resolver` block. The replacement resolver is never started, so its refresh machinery does not run until the server restarts." />
Задаёт тип резолвера. Резолвер `full` хранит все JWT аккаунтов до их явного удаления.

Резолвер `cache` хранит лишь часть JWT, используя TTL и вытеснение давно не использовавшихся записей (LRU).


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | `full`, `cache` |
