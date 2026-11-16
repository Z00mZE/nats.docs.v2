# imports {#imports}

<Reloadable state="reloadable" note="Fully re-resolved, but every reload tears down and re-creates ALL of the account's service-import subscriptions, so there is a short window where imported service subjects have no subscriber and requests arriving in it are dropped." />
Список импортов этого аккаунта.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`stream`](./stream/index.md) | Конфигурация источника импорта потока. Не используется одновременно с `service`. | `object` | - | Да |
| [`service`](./service/index.md) | Конфигурация источника импорта потока. Не используется одновременно со `stream`. | `object` | - | Да |
| [`prefix`](./prefix.md) | Локальный префикс субъектов импортируемого потока. Применяется к `stream`. | `string` | - | Да |
| [`to`](./to.md) | Локальное отображение субъекта импортируемого сервиса. Применяется к `service`. | `string` | - | Да |
