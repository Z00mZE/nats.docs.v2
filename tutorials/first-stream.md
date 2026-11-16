---
id: first-stream
title: "4. Сохранение сообщений с JetStream"
sidebar_position: 5
description: "Создайте первый поток, опубликуйте в него сообщения и прочитайте сохранённые сообщения повторно"
---

# 4. Сохранение сообщений с JetStream {#4-persist-messages-with-jetstream}

До сих пор сообщения были мимолётными: подписчик, не слушавший тему в момент публикации, их не получал. В этом руководстве вы включите JetStream, создадите **поток** для долговременного хранения сообщений, опубликуете несколько сообщений, а затем **прочитаете их повторно** с самого начала. В результате вы убедитесь, что сообщения сохранились и доступны для повторного чтения.

<div class="nats-flow" data-scenario="jetStreamContrastAnimated" data-width="600" data-height="350"></div>

## Что понадобится {#what-youll-need}

- Установленные `nats-server` и CLI `nats` (из руководства [Привет, NATS](/tutorials/hello-nats)).
- Терминалы: в одном вы запустите сервер, в другом будете выполнять команды.

## Шаг 1: запустите сервер с JetStream {#step-1-start-the-server-with-jetstream}

Остановите ранее запущенный сервер и запустите новый с флагом `-js`. Этот флаг включает JetStream — подсистему хранения сообщений.

```bash
nats-server -js
```

В журнале запуска должна появиться информация о JetStream, включая строку вида:

```
[INF] Starting JetStream
[INF] Server is ready
```

Оставьте сервер работающим. Для остальных шагов откройте второй терминал.

## Шаг 2: создайте поток {#step-2-create-a-stream}

Во втором терминале создайте поток `EVENTS`, который сохраняет сообщения из всех тем, начинающихся с `events.`. Флаг `--defaults` подставляет разумные начальные значения, чтобы команда не задавала вопросов.

<div class="nats-example" data-type="tutorials-first-stream-create" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Вывод должен заканчиваться следующим:

```
Stream EVENTS was created
```

Поток создан и ожидает сообщения.

## Шаг 3: опубликуйте несколько сообщений {#step-3-publish-a-few-messages}

Опубликуйте три сообщения в темы с префиксом `events.`. Поскольку каждая тема соответствует настройкам потока, сервер сохранит все сообщения.

<div class="nats-example" data-type="tutorials-first-stream-publish" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Для каждой публикации должны появиться две строки: подтверждение отправки и подтверждение сохранения в потоке с присвоенным порядковым номером:

```
13:42:01 Published 16 bytes to "events.page_loaded"
13:42:01 Stored in Stream: EVENTS Sequence: 1
13:42:01 Published 17 bytes to "events.input_changed"
13:42:01 Stored in Stream: EVENTS Sequence: 2
13:42:01 Published 19 bytes to "events.page_loaded"
13:42:01 Stored in Stream: EVENTS Sequence: 3
```

Убедитесь, что в потоке три сообщения:

```bash
nats stream info EVENTS
```

В блоке `State` должно быть указано три сообщения:

```
State:

             Messages: 3
                Bytes: 159 B
       First Sequence: 1 @ 2026-06-09 13:42:01
        Last Sequence: 3 @ 2026-06-09 13:42:01
     Active Consumers: 0
   Number of Subjects: 2
```

## Шаг 4: прочитайте сохранённые сообщения повторно {#step-4-replay-the-stored-messages}

Теперь прочитайте сообщения из хранилища. Команда воспроизводит все сообщения потока от самого первого, начиная с наиболее старых. Ничего не удаляется: воспроизведение потока — это чтение.

<div class="nats-example" data-type="tutorials-first-stream-replay" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Вы должны увидеть все три сообщения в порядке публикации:

```
[#1] Received JetStream message: stream: EVENTS seq: 1 / pending: 2 / subject: events.page_loaded / time: 2026-06-09 13:42:01
{"page":"/home"}

[#2] Received JetStream message: stream: EVENTS seq: 2 / pending: 1 / subject: events.input_changed / time: 2026-06-09 13:42:01
{"field":"email"}

[#3] Received JetStream message: stream: EVENTS seq: 3 / pending: 0 / subject: events.page_loaded / time: 2026-06-09 13:42:01
{"page":"/pricing"}
```

Команда завершится сама после чтения всех сохранённых сообщений. Запустите её снова — вы увидите те же три сообщения: они по-прежнему в потоке.

## Что вы создали {#what-you-built}

Вы включили JetStream, создали поток `EVENTS`, опубликовали в него три сообщения и прочитали все три из хранилища. После этого они остались доступны для повторного чтения.

## Дальше {#next}

- Следующее руководство: [Чтение потока долговременным потребителем](/tutorials/stream-consumer) — читатель, который отслеживает обработанные сообщения и продолжает работу после перезапуска.
- Как это работает: [углублённый курс JetStream](/learn/jetstream) объясняет устройство потока, а глава [Первый поток](/learn/jetstream/your-first-stream) разбирает все значения, которые JetStream заполнил автоматически.
