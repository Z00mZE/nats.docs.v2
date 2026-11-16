# max_concurrent_io {#max_concurrent_io}

<Since version="2.15" />
<Reloadable state="reloadable" note="Only reloadable while JetStream is being disabled in the same reload (the whole `jetstream` block removed or `enabled: false` set). Any other change while JetStream stays enabled fails the reload." />
Максимальное число одновременно выполняемых дисковых операций ввода-вывода на сервере суммарно для всех потоков и потребителей. Допустимы значения от 4 до 8192. Уменьшите значение, чтобы снизить конкуренцию за диск на сервере с множеством ресурсов; увеличьте для быстрого хранилища, допускающего больше параллельных операций.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `integer` | - | - |
