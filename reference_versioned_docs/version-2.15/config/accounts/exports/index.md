# exports {#exports}

<Reloadable state="reloadable" note="The whole export set is discarded and rebuilt from the config file on every reload; changes apply to connections that are already up." />
Список экспортов этого аккаунта.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`stream`](./stream.md) | Субъект или шаблон субъекта, в который аккаунт будет публиковать сообщения. Не используется одновременно с `service`. | `string` | - | Да |
| [`service`](./service.md) | Субъект или шаблон субъекта, на который аккаунт будет подписываться. Не используется одновременно со `stream`. | `string` | - | Да |
| [`accounts`](./accounts.md) | Список имён аккаунтов, которым разрешено импортировать поток или сервис. Если список не задан, сервис или поток является общедоступным и может быть импортирован любым аккаунтом. | `string` | - | Да |
| [`response_type`](./response_type.md) | Определяет, состоит ли ответ на запрос сервиса из одного сообщения или потока сообщений. Допустимые значения: `single` и `stream`. | `string` | `single` | Да |
