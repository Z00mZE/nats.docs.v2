---
id: drain-and-shutdown
title: "Плавное завершение"
sidebar_position: 5
description: "Завершение через drain с сохранением находящейся в обработке работы"
---

# Плавное завершение {#drain--shutdown}

События сделали автомат наблюдаемым. Теперь выполним намеренный выход: при развёртывании, переносе пода или SIGTERM есть несколько секунд для чистого завершения.

Простой выход теряет очередь warehouse и ещё не отправленную публикацию order-svc. Сначала закончим незавершённое.

Различим close/drain и ограничение drain timeout, затем отдельную подписку и flush.

## Close обрывает работу {#close-drops-in-flight-work}

**Close** сразу закрывает сокет без UNSUB и ожидания обработчиков. Библиотечный Close() пытается отправить буфер записи, но прекращает входящие доставки и удаляет reconnect buffer. SIGKILL теряет даже буфер записи.

Есть два вида незавершённого.

**Входящие** уже доставлены клиенту, но обработчик не закончил. Buffered orders.created при close не дойдут до warehouse.

**Исходящие** ещё в write buffer. Чистый Close обычно отправляет их; падение или SIGKILL уничтожает вместе с процессом.

Close уместен тестам и ненужным соединениям на ошибочном пути. Плановая остановка требует drain.

## Drain завершает перед закрытием {#drain-finishes-in-flight-work-then-closes}

**Drain** упорядоченно завершает работу. Обычно Drain(), в C# — dispose с DrainSubscriptionsOnDispose.

Две фазы: DRAINING_SUBS и DRAINING_PUBS видны в Go/Python. Сначала UNSUB всем подпискам и завершение полученного, затем отправка всех публикаций и close. Другие клиенты скрывают фазы внутри.

Порядок важен: остановить поступление, закончить работу, отправить результат и закрыть.

Анимация сопоставляет потерю при close с доработкой и flush при drain.

<div class="nats-flow" data-scenario="drainVsCloseAnimated" data-width="600" data-height="350"></div>

## Drain по сигналу {#drain-on-a-shutdown-signal}

В обработчике SIGTERM запускайте drain и ждите CLOSED перед выходом. Warehouse завершит очередь, order-svc отправит публикации.

Python/JS await nc.drain() ждёт конца. Go Drain() возвращает сразу: нужен ClosedHandler и ожидание. Выход сразу после возврата теряет работу.

CLI nats sub по Ctrl-C закрывается. Nats reply вызывает Drain, но выходит сразу, не ожидая фона: показывает место вызова, не полный надёжный шаблон. Код приложения должен ждать CLOSED.

<div class="nats-example" data-type="learn-resilient-clients-drain-and-shutdown-drain-on-signal" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Прежнее событие заказа:

```json
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

В DRAINING_SUBS публикации обычно допустимы, чтобы обработчики отправили ответы. В DRAINING_PUBS новые отклоняются, Go — ErrConnectionDraining. Публикация сразу после Drain гоняется с фазой, поэтому сначала прекращайте производство работы, drain последним.

## Ограничение времени drain {#the-drain-timeout-bounds-how-long-drain-waits}

**Drain timeout** не даёт зависшему обработчику удержать процесс. В Go/Python ограничивает подписки: остаток отбрасывается, затем flush и close. В Go финальный flush отдельно ограничен пятью секундами; Java переданный срок включает его. Go сообщает ErrDrainTimeout.

Стандарт Go 30 секунд. Выбирайте по самому медленному обработчику: секунда при пятиисекундной записи БД обрывает работу при каждом развёртывании.

<div class="nats-example" data-type="learn-resilient-clients-drain-and-shutdown-drain-timeout" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Точные API — в библиотеке, сервер — в [справочнике](/reference/).

## Drain одной подписки {#draining-a-single-subscription}

Можно вывести одну подписку, сохранив остальные и соединение: UNSUB, затем завершение её очереди.

Типично для одного участника [группы очереди](/learn/core-nats/queue-groups) warehouse: он дорабатывает свои заказы, остальные получают новые.

Go Subscription.Drain(), JS/Python sub.drain(), Java Subscription/Dispatcher drain(Duration) с future. Rust Subscriber::drain() отписывает сразу, поток заканчивается после остатка.

C# отдельного drain нет: dispose подписки завершает канал и теряет сообщения в пути. У соединения включите DrainSubscriptionsOnDispose, стандарт false: UNSUB, PING/PONG с DrainPingTimeout, стандарт пять секунд, затем завершение каналов. Для настоящей работы включайте.

CLI не демонстрирует отдельную подписку: nats sub имеет одну и закрывает по Ctrl-C. Пример запускает участника warehouse:

<div class="nats-example" data-type="learn-resilient-clients-drain-and-shutdown-drain-subscription" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

## Flush {#flush}

**Flush** — PING с ожиданием PONG. Сервер обрабатывает по порядку, поэтому ответ доказывает получение предшествующих публикаций. Это отдельный барьер без закрытия.

Он не доказывает доставку подписчику или сохранение: последнее подтверждает [PubAck JetStream](/learn/jetstream/publishing).

Go Flush() ждёт до десяти секунд, FlushTimeout() — ваш срок. Python nc.flush(), Java flush(Duration), JS await nc.flush(). C# PingAsync() делает обмен и возвращает время. Rust client.flush() ждёт лишь передачи байтов сокету, не PONG: получение сервером не подтверждает.

Drain уже включает flush. Отдельный нужен после серии публикаций перед признанием отправки либо перед close на ошибочном пути.

RTT использует тот же обмен: Go RTT(), Python/JS rtt(), Java RTT(), C# PingAsync(). Rust async не имеет ни RTT, ни round-trip flush. CLI nats rtt усредняет пять обменов каждого сервера; flush отдельной команды не имеет:

<div class="nats-example" data-type="learn-resilient-clients-drain-and-shutdown-flush" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

## Сервер уходит первым {#when-the-server-drains-first}

**Lame duck** в INFO с ldm предупреждает о скорой остановке. Клиент может заранее остановить публикации и перейти на другой узел.

Connect_urls исключает уходящий сервер. Discovery и no_advertise рассмотрены [раньше](/learn/resilient-clients/connecting#discovered-servers).

Callback — одно из [событий](/learn/resilient-clients/connection-events). Причины ухода — [Топологии](/learn/topologies/your-first-cluster); для клиента это подсказка.

## Типичные ошибки {#pitfalls}

Три потери при остановке:

**Публикация после Drain.** Операция необратима, финальное событие может пройти либо получить ErrConnectionDraining. Не рассчитывайте на гонку, прекращайте производство раньше.

Обрабатывайте отказ явно:

<div class="nats-example" data-type="learn-resilient-clients-drain-and-shutdown-publish-after-drain" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

**Короткий drain timeout.** Он выбрасывает незавершённое. Измерьте медленную работу и оставьте запас.

**Drain не подтверждает JetStream за вас.** Обработчик analytics должен отправить ack до закрытия, иначе сообщение повторится. Позиция — задача [JetStream](/learn/jetstream/acknowledgment), не канала.

## Что уже готово {#where-you-are}

SIGTERM вызывает drain, очередь обрабатывается, публикации отправляются, зависание ограничено. Один warehouse выходит без остановки группы. Flush проверяет получение без закрытия. Соединение переживает и внешний отказ, и плановый выход собственного процесса.

## Что дальше {#whats-next}

Внутреннее отставание обработчика наполняет буфер — медленный потребитель, без ограничений угрожающий памяти.

Перейдите к [Медленным потребителям](/learn/resilient-clients/slow-consumers).

## См. также {#see-also}

- [Подтверждения JetStream](/learn/jetstream/acknowledgment).
- [Публикация](/learn/jetstream/publishing) — хранение, в отличие от flush.
- [Группы очередей](/learn/core-nats/queue-groups).
- [Первый кластер](/learn/topologies/your-first-cluster) — lame duck.
- [Справочник](/reference/) — протокол; клиентские сроки в API библиотеки.
