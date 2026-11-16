# users {#users}

<Reloadable state="reloadable" />
Список пользователей этого аккаунта.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`username`](./username.md) | Имя пользователя. | `string` | - | Да |
| [`password`](./password.md) | Пароль пользователя. Может быть обычным текстом (не рекомендуется) или хешем bcrypt, полученным командой CLI `nats server passwd`. | `string` | - | Да |
| [`nkey`](./nkey.md) | Открытый NKey пользователя. Значение начинается с символа `U`. Не используется одновременно с `username` и `password`. | `string` | - | Да |
| [`permissions`](./permissions/index.md) |  | `object` | - | Да |
| [`allowed_connection_types`](./allowed_connection_types.md) | Если задано, пользователь ограничен указанными типами соединений. - `STANDARD` — обычное клиентское TCP-соединение по протоколу NATS. - `WEBSOCKET` — соединение WebSocket с NATS при включённой конфигурации `websockets`. - `LEAFNODE` — соединение, установленное настроенным на сервере листовым узлом `remote`. - `MQTT` — соединение клиента MQTT с NATS при включённой конфигурации `mqtt`. | `string` | - | Да |
