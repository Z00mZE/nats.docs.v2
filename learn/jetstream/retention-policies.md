---
id: retention-policies
title: "Политики хранения"
sidebar_position: 14
description: "Три политики хранения и выбор по назначению потока"
---

# Политики хранения {#retention-policies}

На прошлой странице заданы количество, возраст и объём ORDERS — причины удаления при заполнении.

Отдельный вопрос: удалять ли после обработки потребителем? Пределы этого не учитывают; прочитанное и подтверждённое остаётся до ограничения.

Очереди задач нужно удаление после одного обработчика, рассылке — после всех заинтересованных. Одни пределы этого не выражают.

**Политика хранения** определяет готовность сообщения к удалению. При создании ORDERS вы уже выбрали стандартную.

## Три политики {#the-three-policies}

Поле `retention` имеет три значения.

**Limits** — стандарт ORDERS: хранить до первого MaxMsgs, MaxBytes или MaxAge, независимо от чтения и ack. Это журнал в пределах ограничений.

<div class="nats-flow" data-scenario="limitsRetentionAnimated" data-width="580" data-height="284"></div>

**Interest** — хранить, пока не подтвердили *все* потребители с подходящим фильтром. Без интереса сообщение удаляется сразу.

<div class="nats-flow" data-scenario="interestRetentionAnimated" data-width="580" data-height="300"></div>

**WorkQueue** — хранить до подтверждения *одним* потребителем, затем удалить для всех.

<div class="nats-flow" data-scenario="workQueueRetentionAnimated" data-width="580" data-height="288"></div>

Готовность определяют соответственно пределы, все заинтересованные или первое подтверждение.

Ограничения действуют при всех политиках. Interest и WorkQueue добавляют удаление после работы, не заменяя защиту от роста при отставании.

## Выбор по работе {#pick-the-policy-from-the-kind-of-work}

Сначала определите назначение, затем политику.

**Аудит и история → Limits.** Хранить независимо от читателей, позволять поздний старт и повтор с любой позиции. Именно это требуется ORDERS.

**Рассылка всем независимым потребителям → Interest.** После обработки последним сообщение больше не нужно. Получается рассылка без растущего журнала.

**Задача одному обработчику → WorkQueue.** Заказ нужно отправить и удалить после ack; очередь сокращается по мере работы, как в [масштабировании потребителя](/learn/jetstream/worker-pool).

## Очередь отправки WorkQueue {#a-workqueue-stream-for-the-shipping-work}

ORDERS оставьте Limits как историю действий заказчиков. Для работы после оплаты создайте отдельный FULFILLMENT: одна задача одному обработчику, затем удаление. Повторная отправка означает лишнюю посылку.

<div class="nats-example" data-type="learn-jetstream-retention-policies-workQueueCreate" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Новое — только `--retention work`. Проверьте Options в `nats stream info FULFILLMENT`:

```bash
nats stream info FULFILLMENT
```

```
             Subjects: fulfill.>

Options:

            Retention: WorkQueue
       Discard Policy: Old
```

После постановки заказа и ack счётчик возвращается к нулю. Обработчик также публикует orders.shipped в ORDERS: задача уходит из очереди, событие остаётся в журнале.

Обработчики делят **одного** потребителя FULFILLMENT, как [пул](/learn/jetstream/worker-pool). Масштабируйте процессы, а не потребителей: WorkQueue запрещает два пересекающихся получателя.

## Изменение политики живого потока {#switching-retention-on-a-live-stream}

Выбирайте при создании и сохраняйте.

Разрешена только смена Limits ↔ Interest. WorkQueue неизменяема. Даже разрешённый переход сразу влияет на историю: при переходе к Interest удаляются уже подтверждённые всеми и неинтересные сообщения, включая нужный аудит.

Практически считайте политику постоянной. Для другого назначения создавайте новый поток. ORDERS намеренно остаётся Limits.

## Риски Interest и WorkQueue {#how-interest-and-workqueue-can-go-wrong}

У каждой свои ограничения.

**Interest может заполнить диск.** Один зависший потребитель задерживает удаление всех своих неподтверждённых сообщений. Обязательно задавайте пределы и наблюдайте здоровье читателей.

**WorkQueue даёт задаче одного потребителя.** Пересекающиеся фильтры отклоняются. Несколько потребителей допустимы только для непересекающихся частей тем. Для полного представления каждому нужны Limits или Interest; для одной нагрузки — процессы общего пула.

Взаимодействие с republish, зеркалами и источниками описано в [Конфигурации потока](/reference/jetstream/api/stream/create). Здесь три значения retention.

## Типичные ошибки {#pitfalls}

Ограничения WorkQueue проверяются при создании и изменении.

**Переход к WorkQueue или из неё запрещён.** Только Limits и Interest взаимозаменяемы, с описанными последствиями для истории.

Создавайте новый поток и переносите данные. Попытка изменения возвращает `stream configuration update can
not change retention policy to/from workqueue`.

<div class="nats-example" data-type="learn-jetstream-retention-policies-retentionSwitchRejected" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

**WorkQueue запрещает перекрывающихся потребителей.** Второй без фильтра даёт `multiple non-filtered
consumers not allowed on workqueue stream`, пересекающийся фильтр — `filtered consumer not
unique on workqueue stream`.

Разделяйте темы непересекающимися фильтрами либо используйте [пул](/learn/jetstream/worker-pool) одного потребителя.

<div class="nats-example" data-type="learn-jetstream-retention-policies-workqueueOverlap" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

## Что уже готово {#where-you-are}

ORDERS остаётся Limits для истории и повторного чтения.

Теперь вы знаете:

- Кто определяет завершение при Limits, Interest и WorkQueue.
- Соответствие: аудит → Limits, рассылка → Interest, задачи → WorkQueue.
- FULFILLMENT удаляет задачу по ack, ORDERS сохраняет событие.
- Политику следует выбирать при создании.

## Что дальше {#whats-next}

Теперь — [ручное удаление сообщения и очистка потока](/learn/jetstream/altering-stream-state).

## См. также {#see-also}

- [Конфигурация потока](/reference/jetstream/api/stream/create) — retention и взаимодействия.
- [Настройка потока](/learn/jetstream/shaping-the-stream) — ограничения.
- [Пул обработчиков](/learn/jetstream/worker-pool) — общий потребитель для WorkQueue.
