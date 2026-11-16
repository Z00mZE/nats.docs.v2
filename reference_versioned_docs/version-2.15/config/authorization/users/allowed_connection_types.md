# allowed_connection_types {#allowed_connection_types}

<Reloadable state="reloadable" />
Если задано, пользователь ограничен указанными типами соединений.

- `STANDARD` — обычное клиентское TCP-соединение по протоколу NATS.
- `WEBSOCKET` — соединение WebSocket с NATS при включённой конфигурации `websockets`.
- `LEAFNODE` — соединение, установленное настроенным на сервере листовым узлом `remote`.
- `MQTT` — соединение клиента MQTT с NATS при включённой конфигурации `mqtt`.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `[ string ]` | - | `STANDARD`, `WEBSOCKET`, `LEAFNODE`, `MQTT` |
