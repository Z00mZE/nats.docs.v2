# mqtt {#mqtt}

<Reloadable state="reloadable" note="Only `ack_wait`, `max_ack_pending`, the consumer settings and the TLS certificate material reload. Changing the MQTT `host`, `port`, `authorization`, `no_auth_user` or `js_domain` fails the reload." />
Конфигурация включения интерфейса MQTT.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`host`](./host.md) |  | `string` | `0.0.0.0` | Нет |
| [`port`](./port.md) |  | `integer` | `1883` | Нет\* |
| [`listen`](./listen.md) |  | `string` | - | Нет |
| [`tls`](./tls/index.md) |  | `object` | - | Да\* |
| [`authorization`](./authorization/index.md) |  | `object` | - | Нет |
| [`no_auth_user`](./no_auth_user.md) | Если клиент MQTT не передаёт имя пользователя при подключении, это имя используется по умолчанию на этапе аутентификации. Для клиентов MQTT оно переопределяет любое значение `no_auth_user` из основного файла конфигурации. *Примечание: этот вариант несовместим с запуском сервера в режиме оператора.* | `string` | - | Нет |
| [`ack_wait`](./ack_wait.md) | Время, по истечении которого отправленное клиенту сообщение QoS 1 доставляется повторно как `DUPLICATE`, если сервер не получил пакет `PUBACK` с исходным идентификатором пакета. Сервер использует значение по умолчанию (30 секунд). Изменения этого параметра применяются только к новым подпискам MQTT. | `duration` | `30s` | Да\* |
| [`max_ack_pending`](./max_ack_pending.md) | Число сообщений QoS 1, которое сервер может отправить подписке, не получив для них ни одного `PUBACK`. Допустимый диапазон: [0..65535]. Сумма max_ack_pending подписок одного сеанса не может превышать 65535. При попытке создать подписку, превышающую общий лимит, сервер возвращает для неё `0x80` в `SUBACK`. Из-за особенностей обработки подстановки MQTT `#` сервером NATS каждая подписка, оканчивающаяся на `#`, использует удвоенное значение `max_ack_pending`. Изменения этого параметра применяются только к новым подпискам. | `integer` | `100` | Да\* |
| [`js_domain`](./js_domain.md) | Если задано, явно указывает домен JetStream для MQTT. | `string` | - | Нет |
| [`consumer_memory_storage`](./consumer_memory_storage.md) | Хранить состояние потребителей MQTT в памяти, а не на диске. | `boolean` | `false` | Да\* |
| [`consumer_replicas`](./consumer_replicas.md) | Устарело. Сервер записывает предупреждение и игнорирует значение; репликация потребителя определяется потоком. | `integer` | - | Игнорируется\* |
| [`js_api_timeout`](./js_api_timeout.md) | Время ожидания вызова JetStream API в MQTT до отказа. | `duration` | `5s` | Нет |
| [`reject_qos2_publish`](./reject_qos2_publish.md) | Отклонять публикации QoS 2 вместо их принятия для клиентов, которым нельзя незаметно ослаблять гарантии доставки. | `boolean` | `false` | Нет |
| [`downgrade_qos2_subscribe`](./downgrade_qos2_subscribe.md) | Принимать подписку QoS 2, но обслуживать её с QoS 1. | `boolean` | `false` | Нет |
| [`stream_replicas`](./stream_replicas.md) | Если задано, явно указывает число реплик потоков, используемых для MQTT. | `integer` | - | Да\* |
| [`consumer_inactive_threshold`](./consumer_inactive_threshold.md) | Явно задать порог неактивности по умолчанию для потребителей MQTT. | `duration` | - | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
