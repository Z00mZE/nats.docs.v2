---
id: delivery-and-acknowledgment
title: "Доставка и подтверждение"
sidebar_position: 6
description: "Неподтверждённые сообщения, обычное и двойное подтверждение и повторная доставка"
---

# Доставка и подтверждение {#delivery-and-acknowledgment}

[Чтение](/learn/jetstream/reading-back) создало `billing`, [фильтрация](/learn/jetstream/filtering) — `analytics`. Все сообщения успешно подтверждались. Теперь разберём, что делает ack и что будет без него.

**Цикл подтверждения и повторной доставки** обеспечивает потребительскую часть гарантии **не менее одного раза**. Читатель может упасть, обработчик — выбросить ошибку, процесс — завершиться, но сообщение вернётся. Вторая составляющая гарантии — долговременный поток предыдущих страниц.

Заказы и потребители `billing`, `analytics` уже существуют.

## Потребитель для экспериментов {#a-consumer-to-experiment-with}

Создадим отдельный `shipping`, чтобы намеренно пропускать подтверждения. Это pull-потребитель с явным ack, как ранее:

<div class="nats-example"
     data-type="learn-jetstream-your-first-consumer-create"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Он начинает с начала ORDERS и может читать сохранённые заказы.

## Жизненный цикл доставки {#the-delivery-lifecycle}

Состояния сообщения у потребителя:

1. **Доставлено, ожидает подтверждения.** Читатель получил сообщение, данные остаются в потоке. **Граница подтверждений** ещё не прошла его.
2. **Подтверждено.** После обработки клиент отправляет **ack**; граница продвигается, работа этого потребителя завершена.
3. **Повторно доставлено.** Без ack за **Ack Wait** сервер предполагает сбой и выдаёт сообщение тому же или другому читателю этого потребителя.

<div class="nats-flow" data-scenario="jetStreamConsumersAnimated" data-width="600" data-height="380"></div>

Разрыв между доставкой и подтверждением — сообщения в обработке. Сейчас мы намеренно создадим и закроем его.

## Подтвердите сообщение {#acknowledge-a-message}

Запросите и подтвердите одно сообщение shipping:

<div class="nats-example"
     data-type="learn-jetstream-your-first-consumer-pullAndAck"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Первый сохранённый заказ получен и подтверждён:

```
[10:14:52] subj: orders.created / tries: 1 / cons seq: 1 / str seq: 1 / pending: 2

{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}

Acknowledged message
```

`tries: 1` — первая доставка. Проверьте потребителя:

```
State:

  Last Delivered Message: Consumer sequence: 1 Stream sequence: 1
    Acknowledgment Floor: Consumer sequence: 1 Stream sequence: 1
        Outstanding Acks: 0 out of maximum 1,000
    Redelivered Messages: 0
```

Оба курсора дошли до 1: доставка и ack, ничего не ожидает подтверждения. `tries`, номера и остаток доступны в метаданных сообщения без отдельного `nats consumer info`. Полное состояние здесь лишь показывает продвижение границы.

## Двойное подтверждение: убедитесь, что ack принят {#double-ack-make-sure-the-ack-landed}

Обычный ack отправляется без ожидания ответа. Если он потерялся при разрыве соединения, сервер не сдвинет границу и повторит сообщение после Ack Wait. Уже обработанное придёт снова.

**Двойное подтверждение** ждёт серверного подтверждения ack. Оно полезно, когда повторная обработка вредна и обработчик нельзя сделать идемпотентным, например при списании платежа. Цена — дополнительный сетевой обмен на сообщение, поэтому это явный выбор.

<div class="nats-flow" data-scenario="doubleAckAnimated" data-width="560" data-height="240"></div>

Флага CLI нет: это вызов библиотеки. Запросите сообщение и выполните двойное подтверждение:

<div class="nats-example"
     data-type="learn-jetstream-your-first-consumer-doubleAck"
     data-languages="js,go,python,java,rust,csharp,c"></div>

Имена различаются: `DoubleAck` в Go, `ackAck` в JavaScript, `ack_sync` в Python, `ackSync` в Java, `AckAsync` с соответствующей опцией в .NET, `double_ack` в Rust. Все ждут ответа сервера.

## Повторная доставка без ack {#redelivery-when-a-message-isnt-acked}

Получите сообщение, не подтверждая:

<div class="nats-example"
     data-type="learn-jetstream-your-first-consumer-next"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Заказ с номером 2 остаётся в обработке. Состояние показывает разрыв:

```
State:

  Last Delivered Message: Consumer sequence: 2 Stream sequence: 2
    Acknowledgment Floor: Consumer sequence: 1 Stream sequence: 1
        Outstanding Acks: 1 out of maximum 1,000
    Redelivered Messages: 0
```

Last Delivered равен 2, Acknowledgment Floor — 1; `Outstanding Acks: 1`. Через стандартные 30 секунд Ack Wait запросите снова: номер 2 придёт с `tries: 2`.

Повтор не восстанавливает общий порядок. Обычно сообщений в обработке несколько; `out of maximum 1,000` — **MaxAckPending**, предел неподтверждённых доставок. Пока одно ждёт повтора, выдаются следующие, поэтому повтор может прийти после больших номеров.

<div class="nats-flow" data-scenario="redeliveryOrderAnimated" data-width="660" data-height="220"></div>

Для строгого порядка задайте MaxAckPending равным 1: следующее не выдаётся до подтверждения текущего.

```bash
nats consumer edit ORDERS shipping --max-pending 1
```

Это уменьшает пропускную способность, исключая параллельную обработку. Используйте лишь при необходимости порядка.

Можно запросить немедленный повтор, отказаться от необрабатываемого сообщения или сообщить о продолжающейся работе. Сервер задаёт интервалы и предел попыток. Это тема [следующей страницы](/learn/jetstream/acknowledgment).

## Типичные ошибки {#pitfalls}

**Забытый ack.** Успешная обработка без подтверждения для сервера равна сбою. После Ack Wait сообщение вернётся, а при стандартном неограниченном числе попыток — бесконечно. Подтверждайте успех. [Далее](/learn/jetstream/acknowledgment) показано прекращение доставок неисправимого сообщения.

**Два ack одной доставки.** Второй не продвигает границу. Go и Python могут локально вернуть *message was already acknowledged*, другие библиотеки игнорируют или пересылают повтор; сервер его игнорирует. Подтверждайте каждую доставку один раз в одном месте.

## Что уже готово {#where-you-are}

У долговременного pull-потребителя shipping с явным ack вы увидели цикл:

- Сообщение **доставлено** и **ожидает подтверждения**.
- **Ack**, при необходимости **двойной ack**, продвигает границу подтверждений.
- Без подтверждения сообщение **возвращается** после Ack Wait.

Число доставок `tries` приходит с каждым сообщением.

## Что дальше {#whats-next}

Далее — ack, nak, term, in-progress и настройки Ack Wait, MaxDeliver, backoff, определяющие сроки повторов и их прекращение.

## См. также {#see-also}

- [Справочник → Создание потребителя](/reference/jetstream/api/consumer/create) — настройки, политики подтверждения и push-потребители.
