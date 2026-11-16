# allowed_origins {#allowed_origins}

<Aliases aliases="allowed_origin, allow_origins, allow_origin, origins, origin" />
<Reloadable state="not-reloadable" />
Список допустимых источников. Если список пуст и `same_origin` равен `false`, разрешены клиенты из любого источника.

Список задаёт единственные допустимые значения заголовка `Origin` в запросе клиента. Схема, хост и порт должны совпадать. Если TCP-порт в URL не указан, для схемы "http://" подразумевается порт 80, а для "https://" — 443.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `[ string ]` | - | - |
