# limits {#limits}

<Reloadable state="not-reloadable" note="Starting in 2.15, a change to this block no longer aborts the reload; see the individual keys below it." />
Лимиты JetStream по умолчанию для аккаунтов.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`max_ack_pending`](./max_ack_pending.md) | Задаёт максимальное число сообщений в обработке, которое можно настроить для потребителей. | `integer` | - | Нет |
| [`max_ha_assets`](./max_ha_assets.md) | Максимальное число одновременно существующих ресурсов JetStream с более чем одной репликой. | `integer` | - | Нет |
| [`max_request_batch`](./max_request_batch.md) | Максимальный размер запрашиваемого пакета, который можно настроить для pull-потребителей. | `integer` | - | Нет |
| [`duplicate_window`](./duplicate_window.md) | Максимальная длительность окна дедупликации, которую можно настроить для потока. | `duration` | - | Нет |
