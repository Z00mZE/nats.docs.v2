---
id: stream-consumer
title: "5. Потребитель, переживающий перезапуски"
sidebar_position: 6
description: "Читайте поток долговременным потребителем, подтверждайте каждое сообщение и продолжайте с места остановки после перезапуска"
---

# 5. Потребитель, переживающий перезапуски {#5-a-consumer-that-survives-restarts}

В [предыдущем руководстве](/tutorials/first-stream) вы сохранили сообщения в **потоке**. Теперь вы прочитаете их с помощью долговременного **потребителя**: запросите каждое сообщение, подтвердите его, остановите сервер и запустите снова. Потребитель продолжит ровно с места остановки — без повторного чтения и пропусков сообщений.

<div class="nats-flow" data-scenario="jetStreamConsumersAnimated" data-width="600" data-height="350"></div>

## Что понадобится {#what-youll-need}

- Установленный CLI `nats`.
- Работающий `nats-server` с включённым JetStream и поток `EVENTS` с несколькими сообщениями, созданный в [руководстве 4: Сохранение сообщений с JetStream](/tutorials/first-stream). Оставьте этот сервер работающим.

## Шаг 1: начните с нового набора из трёх сообщений {#step-1-start-from-a-clean-set-of-three-messages}

Чтобы порядковые номера совпадали с примерами, приведите поток `EVENTS` к известному состоянию. Очистка потока сохраняет счётчик порядковых номеров, поэтому удалите поток из руководства 4 и создайте заново: нумерация снова начнётся с 1:

```bash
nats stream rm EVENTS --force
nats stream add EVENTS --subjects "events.>" --defaults
```

Удаление ничего не выводит. Повторное создание выводит конфигурацию нового потока, заканчивающуюся следующим:

```
Stream EVENTS was created
```

Теперь опубликуйте три новых сообщения для потребителя:

```bash
nats pub events.page_loaded '{"page":"/home"}' --jetstream
nats pub events.input_changed '{"field":"email"}' --jetstream
nats pub events.page_loaded '{"page":"/pricing"}' --jetstream
```

Сервер должен подтвердить каждую публикацию и показать присвоенный потоком порядковый номер:

```
14:22:01 Published 16 bytes to "events.page_loaded"
14:22:01 Stored in Stream: EVENTS Sequence: 1
14:22:01 Published 17 bytes to "events.input_changed"
14:22:01 Stored in Stream: EVENTS Sequence: 2
14:22:01 Published 19 bytes to "events.page_loaded"
14:22:01 Stored in Stream: EVENTS Sequence: 3
```

Убедитесь, что в потоке ровно три ваших сообщения:

```bash
nats stream info EVENTS
```

В блоке `State` значение `Messages` должно быть равно `3`.

## Шаг 2: добавьте долговременного потребителя {#step-2-add-a-durable-consumer}

Создайте для потока `EVENTS` долговременного pull-потребителя с именем `worker`. Pull-потребитель выдаёт сообщения по запросу; каждое сообщение подтверждается отдельно.

<div class="nats-example" data-type="tutorials-stream-consumer-add-consumer" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Должны появиться подтверждение создания потребителя и его конфигурация:

```
Information for Consumer EVENTS > worker

Configuration:

                    Name: worker
               Pull Mode: true
          Deliver Policy: All
              Ack Policy: Explicit
```

Имя `worker` делает потребителя **долговременным (durable)**: после прекращения чтения сервер сохраняет под этим именем самого потребителя и его позицию в потоке.

## Шаг 3: запросите и подтвердите сообщение {#step-3-pull-and-acknowledge-a-message}

Запросите у потребителя следующее сообщение и подтвердите его:

<div class="nats-example" data-type="tutorials-stream-consumer-pull-and-ack" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Вы должны увидеть первое сообщение, а затем подтверждение:

```
[14:23:10] subj: events.page_loaded / tries: 1 / cons seq: 1 / str seq: 1 / pending: 2

{"page":"/home"}

Acknowledged message
```

`{"page":"/home"}` — тело первого опубликованного вами сообщения. `pending: 2` означает, что ожидают ещё два сообщения, а строка `Acknowledged message` подтверждает, что сервер зафиксировал завершение обработки этого сообщения.

Выполните ту же команду ещё раз, чтобы прочитать и подтвердить второе сообщение:

```bash
nats consumer next EVENTS worker --ack
```

Вы должны увидеть `{"field":"email"}`, `cons seq: 2` и `pending: 1`.

## Шаг 4: проверьте позицию чтения {#step-4-check-how-far-youve-read}

Посмотрите, насколько продвинулся потребитель:

```bash
nats consumer info EVENTS worker
```

В блоке `State` должна быть показана позиция после двух подтверждённых сообщений:

```
State:

   Last Delivered Message: Consumer sequence: 2 Stream sequence: 2
     Acknowledgment Floor: Consumer sequence: 2 Stream sequence: 2
         Outstanding Acks: 0 out of maximum 1,000
```

`Acknowledgment Floor` показывает, что подтверждены сообщения вплоть до номера 2, поэтому следующий запрос чтения выдаст сообщение 3.

## Шаг 5: перезапустите сервер и продолжите {#step-5-restart-and-resume}

Теперь смоделируйте перезапуск. Остановите сервер с помощью `Ctrl+C` в его терминале, затем запустите так же, как в руководстве 4, чтобы он прочитал поток и потребителя из прежнего хранилища:

```bash
nats-server -js
```

Поток и потребитель восстановятся в прежнем состоянии. Запросите следующее сообщение:

```bash
nats consumer next EVENTS worker --ack
```

Вы должны увидеть третье сообщение, а не первое:

```
[14:25:40] subj: events.page_loaded / tries: 1 / cons seq: 3 / str seq: 3 / pending: 0

{"page":"/pricing"}

Acknowledged message
```

Потребитель продолжил точно с места остановки. `pending: 0` означает, что вы прочитали все сообщения. Ни одно не доставлялось повторно и ни одно не было пропущено.

## Что вы создали {#what-you-built}

Долговременного потребителя, который запрашивает сообщения из потока, подтверждает каждое и возобновляет чтение после перезапуска. В этом сценарии читатель продолжает с места остановки, без повторов и пропусков.

## Дальше {#next}

- Следующее руководство: [Небольшое хранилище состояния на Key-Value](/tutorials/key-value).
- Разберитесь в механизмах подтверждения, повторной доставки и курсора: [JetStream: доставка и подтверждение](/learn/jetstream/delivery-and-acknowledgment).
