# limits {#limits}

<Reloadable state="reloadable" note="Each key is enforced when the stream or consumer it applies to is created or updated, so an already-existing asset keeps the value that applied when it was made — see the individual keys below for exceptions." />
Лимиты JetStream по умолчанию для аккаунтов.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`batch`](./batch/index.md) | Ограничения атомарной пакетной публикации. | `object` | - | Да\* |
| [`max_ack_pending`](./max_ack_pending.md) | Задаёт максимальное число сообщений в обработке, которое можно настроить для потребителей. | `integer` | - | Да\* |
| [`max_ha_assets`](./max_ha_assets.md) | Максимальное число одновременно существующих ресурсов JetStream с более чем одной репликой. | `integer` | - | Нет |
| [`max_request_batch`](./max_request_batch.md) | Максимальный размер запрашиваемого пакета, который можно настроить для pull-потребителей. | `integer` | - | Да\* |
| [`duplicate_window`](./duplicate_window.md) | Максимальная длительность окна дедупликации, которую можно настроить для потока. | `duration` | - | Да\* |
| [`default_max_consumers`](./default_max_consumers.md) | Максимальное число потребителей по умолчанию для потока, не задающего собственный `max_consumers`, если у его аккаунта тоже нет лимита потребителей. Значение `-1` отключает этот предел и разрешает неограниченное число потребителей, как в версиях до 2.15. | `integer` | `1000` | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
