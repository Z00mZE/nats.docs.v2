# batch {#batch}

<Since version="2.12" />
<Reloadable state="reloadable" note="Enforced when a batch publish starts, so a batch already in progress is unaffected. Only a batch started after the reload sees the new ceiling." />
Ограничения атомарной пакетной публикации.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`max_msgs`](./max_msgs.md) | Допустимое число сообщений в одном пакете. | `integer` | `1000` | Да\* |
| [`max_inflight_total`](./max_inflight_total.md) | Допустимое число одновременно выполняемых пакетов на сервере. | `integer` | `1000` | Да\* |
| [`max_inflight_per_stream`](./max_inflight_per_stream.md) | Допустимое число одновременно выполняемых пакетов для одного потока. | `integer` | `50` | Да\* |
| [`timeout`](./timeout.md) | Время хранения незавершённого пакета до его отбрасывания. | `duration` | `10s` | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
