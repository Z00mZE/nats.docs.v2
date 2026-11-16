# interval {#interval}

<Reloadable state="reloadable" note="Handled only as part of the whole `resolver` block; the replacement resolver is never Start()ed so the running sync loop keeps the old interval." />
Задаёт интервал, с которым резолвер обращается к случайному другому серверу для сверки JWT: получения новых и удаления старых.

Применяется только в режиме `full`.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `duration` | Длительность в виде строки с единицами измерения, например 100ms, 10s, 5m или 2h. | - |
