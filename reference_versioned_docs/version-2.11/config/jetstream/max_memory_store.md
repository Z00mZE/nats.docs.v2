# max_memory_store {#max_memory_store}

<Aliases aliases="max_mem_store, max_mem" />
<Reloadable state="not-reloadable" note="2.12/2.14: increases only, and only while JetStream stays enabled. 2.11: never, while enabled." />
Максимальный размер хранилища *в памяти*. По умолчанию 75% доступной памяти.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `storage` | Размер в байтах или строка с метрической единицей, например 100K, 50M, 3G или 1T. | - |
