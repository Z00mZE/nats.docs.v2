# limits {#limits}

<Reloadable state="reloadable" note="max_connections, max_subscriptions and max_payload are re-applied to already-connected clients. max_leafnodes is the exception - see that page." />

## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`max_connections`](./max_connections.md) | Максимальное число одновременных соединений этого аккаунта. | `integer` | - | Да\* |
| [`max_subscriptions`](./max_subscriptions.md) | Максимальное число одновременных подписок этого аккаунта. | `integer` | - | Да\* |
| [`max_payload`](./max_payload.md) | Максимальный допустимый размер полезной нагрузки сообщений. | `integer` | - | Да\* |
| [`max_leafnodes`](./max_leafnodes.md) | Максимальное допустимое число одновременных соединений листовых узлов. | `integer` | - | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
