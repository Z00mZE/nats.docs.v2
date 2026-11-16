# Уведомления JetStream {#jetstream-advisories}

Уведомления — системные события, публикуемые серверами JetStream при важных изменениях состояния и событиях эксплуатации. События отправляются в определённые темы, на которые можно подписаться для мониторинга и наблюдаемости.

## События уведомлений {#advisory-events}

| Название | Тема | Описание |
| ---- | ------- | ----------- |
| [Аудит API](./api-audit.md) | `$JS.EVENT.ADVISORY.API` | Журнал аудита операций API JetStream |
| [Достигнут лимит API](./api-limit-reached.md) | `$JS.EVENT.ADVISORY.API.LIMIT_REACHED` | Достигнут лимит очереди запросов API |
| [Действие с потребителем](./consumer-action.md) | `$JS.EVENT.ADVISORY.CONSUMER.CREATED.{stream}.{consumer}`<br/>`$JS.EVENT.ADVISORY.CONSUMER.DELETED.{stream}.{consumer}` | События жизненного цикла потребителя |
| [Группа потребителей закреплена](./consumer-group-pinned.md) | `$JS.EVENT.ADVISORY.CONSUMER.PINNED.{stream}.{consumer}` | Группа потребителей закреплена за клиентом |
| [Группа потребителей откреплена](./consumer-group-unpinned.md) | `$JS.EVENT.ADVISORY.CONSUMER.UNPINNED.{stream}.{consumer}` | Группа потребителей откреплена от клиента |
| [Выбран лидер потребителя](./consumer-leader-elected.md) | `$JS.EVENT.ADVISORY.CONSUMER.LEADER_ELECTED.{stream}.{consumer}` | Выбран новый лидер потребителя |
| [Приостановка потребителя](./consumer-pause.md) | `$JS.EVENT.ADVISORY.CONSUMER.PAUSE.{stream}.{consumer}` | Потребитель приостановлен или возобновлён |
| [Потеря кворума потребителя](./consumer-quorum-lost.md) | `$JS.EVENT.ADVISORY.CONSUMER.QUORUM_LOST.{stream}.{consumer}` | Потребитель потерял кворум |
| [Выбран лидер домена](./domain-leader-elected.md) | `$JS.EVENT.ADVISORY.DOMAIN.LEADER_ELECTED` | Выбран новый лидер домена |
| [Превышен лимит доставок](./max-deliver.md) | `$JS.EVENT.ADVISORY.CONSUMER.MAX_DELIVERIES.{stream}.{consumer}` | Превышено максимальное число попыток доставки сообщения |
| [Отрицательное подтверждение сообщения](./nak.md) | `$JS.EVENT.ADVISORY.CONSUMER.MSG_NAKED.{stream}.{consumer}` | Получено отрицательное подтверждение сообщения |
| [Доставка сообщения прекращена](./terminated.md) | `$JS.EVENT.ADVISORY.CONSUMER.MSG_TERMINATED.{stream}.{consumer}` | Доставка сообщения прекращена |
| [Восстановление завершено](./restore-complete.md) | `$JS.EVENT.ADVISORY.STREAM.RESTORE_COMPLETE.{stream}` | Восстановление потока завершено |
| [Восстановление начато](./restore-create.md) | `$JS.EVENT.ADVISORY.STREAM.RESTORE_CREATE.{stream}` | Инициировано восстановление потока |
| [На сервере нет места](./server-out-of-space.md) | `$JS.EVENT.ADVISORY.SERVER.OUT_OF_STORAGE` | Хранилище сервера исчерпано |
| [Сервер удалён](./server-removed.md) | `$JS.EVENT.ADVISORY.SERVER.REMOVED` | Сервер удалён из кластера |
| [Создание снимка завершено](./snapshot-complete.md) | `$JS.EVENT.ADVISORY.STREAM.SNAPSHOT_COMPLETE.{stream}` | Снимок потока создан |
| [Создание снимка начато](./snapshot-create.md) | `$JS.EVENT.ADVISORY.STREAM.SNAPSHOT_CREATE.{stream}` | Инициировано создание снимка потока |
| [Действие с потоком](./stream-action.md) | `$JS.EVENT.ADVISORY.STREAM.CREATED.{stream}`<br/>`$JS.EVENT.ADVISORY.STREAM.DELETED.{stream}`<br/>`$JS.EVENT.ADVISORY.STREAM.UPDATED.{stream}` | События жизненного цикла потока |
| [Атомарный пакет отброшен](./stream-batch-abandoned.md) | `$JS.EVENT.ADVISORY.STREAM.BATCH_ABANDONED.{stream}` | Поток отбросил атомарный пакет |
| [Выбран лидер потока](./stream-leader-elected.md) | `$JS.EVENT.ADVISORY.STREAM.LEADER_ELECTED.{stream}` | Выбран новый лидер потока |
| [Потеря кворума потока](./stream-quorum-lost.md) | `$JS.EVENT.ADVISORY.STREAM.QUORUM_LOST.{stream}` | Поток потерял кворум |

## Подписка на уведомления {#subscribing-to-advisories}

Для получения уведомлений подпишитесь на подходящий шаблон темы. Подстановочные символы позволяют получать несколько типов уведомлений:

- `$JS.EVENT.ADVISORY.>` — все уведомления
- `$JS.EVENT.ADVISORY.STREAM.>` — все уведомления о потоках
- `$JS.EVENT.ADVISORY.CONSUMER.>` — все уведомления о потребителях