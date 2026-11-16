---
id: reconnection
title: "Переподключение"
sidebar_position: 3
description: "Восстановление по пулу с backoff и jitter и буферизация публикаций на время разрыва"
---

# Переподключение {#reconnection}

Order-svc имеет имя, пул и срок подключения. Но рестарт, развёртывание или потеря n1/n2/n3 разрывают уже работающий канал.

Клиент перебирает пул с задержками и возвращается. Публикации приложения накапливаются и отправляются после восстановления. Так серверный отказ не требует переписывать приложение.

Две идеи — backoff/jitter и буфер. Сначала RECONNECTING, затем распространение повторов на самый первый connect.

## Разрыв и RECONNECTING {#the-disconnect-and-the-reconnecting-state}

**Разрыв** обнаруживается закрытием сокета или отсутствующим ответом keepalive. Клиент сообщает callback, но не закрывается: переходит из CONNECTED в **RECONNECTING**.

Он перебирает URL до успешного handshake, возвращается в CONNECTED и сообщает reconnect.

```
CONNECTED ──disconnect──▶ RECONNECTING ──PONG──▶ CONNECTED
                              │
                              └──pool exhausted, retries spent──▶ CLOSED
```

По умолчанию включено: Go AllowReconnect, Python allow_reconnect, JavaScript reconnect; Java отключает noReconnect(). Rust/C# отдельного выключателя не имеют, только предел max_reconnects/MaxReconnectRetry, стандартно неограниченный. Обычно оставляйте включённым.

## Повтор первого подключения {#retrying-the-first-connect}

Обычная защита действует после хотя бы одного успеха. Большинство клиентов при первом недоступном пуле возвращают ошибку, не RECONNECTING. Эта обработка из [Подключения](/learn/resilient-clients/connecting) выявляет неверный адрес сразу; Python отличается.

Но после развёртывания приложение часто стартует раньше серверов и попадает в цикл падений. Можно включить повтор первого входа:

- Go RetryOnFailedConnect(true) сразу возвращает объект RECONNECTING; успех сообщает ConnectHandler, используются стандартные настройки повторов.
- JavaScript waitOnFirstConnect: true оставляет connect promise ожидающим; предел попыток действует после первого успеха.
- Python await nc.connect() уже перебирает до исчерпания каждого сервера; max_reconnect_attempts=-1 ждёт бесконечно, allow_reconnect=False прекращает на первой ошибке.
- Java Nats.connectReconnectOnConnect(options) ждёт с повторами; Nats.connectAsynchronously(options, true) делает фоном через обязательный listener.
- Rust retry_on_initial_connect() сразу возвращает клиент и подключает фоном вместо стандартной ошибки.
- C# RetryOnInitialConnect = true повторяет ConnectAsync или первую операцию до успеха либо отмены.

Тогда приложение ждёт серверы вместо перезапусков. CLI аналогичного флага не имеет и сразу отказывает.

## Backoff и jitter {#backoff-and-jitter}

После обхода пула без успеха клиент ждёт **backoff**. Go/Java/Python/JavaScript стандартно ждут одинаково каждый раз, рост задаётся callback. Rust/.NET увеличивают задержку сами.

База ReconnectWait обычно две секунды. **Jitter** — случайная добавка против синхронного наплыва клиентов: Go/Java/JavaScript до 100 мс открытого канала, до секунды TLS; C# до 100 мс всегда. Python и Rust случайности не добавляют: фиксированная reconnect_time_wait либо растущая задержка.

Go CustomReconnectDelay получает число полных обходов, Java reconnectDelayHandler — число попыток, JavaScript одноимённый callback без аргументов возвращает миллисекунды, Python reconnect_to_server_handler — следующий сервер и ожидание. Go/JS не добавляют jitter поверх результата: включите сами. CLI использует бесконечные повторы, рост от 500 мс до 20 секунд и разброс 0,5–1,5 значения:

```go
nats.MaxReconnects(-1),
nats.CustomReconnectDelay(func(attempts int) time.Duration {
    return backoff.Duration(attempts) // 500ms rising to a 20s cap, jitter included
}),
```

MaxReconnect ограничивает попытки до CLOSED. Go/Java/JS/Python учитывают по серверу и удаляют исчерпавшие; Go/Python сбрасывают после успеха. Стандарты: 60 у Go/Java/Python, 10 JS, бесконечно Rust/C#. Длительному order-svc задайте -1 там, где предел есть. Rust выражает бесконечность отсутствием max_reconnects.

Настройка order-svc: бесконечно, две секунды базы, стандартный jitter.

<div class="nats-example" data-type="learn-resilient-clients-reconnection-reconnect-options" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Прежнее событие заказа:

```json
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

Точные параметры — в API библиотеки, протокол и сервер — в [справочнике](/reference/).

## Наблюдение восстановления {#observe-a-reconnect}

Для проверки достаточно одного сервера: остановите и верните под работающим подписчиком.

Запустите:

```bash
nats-server
```

В другом терминале подпишитесь с trace:

```bash
nats sub "orders.>" --connection-name order-svc --trace
```

Ctrl-C и повторный запуск сервера дадут `>>> Disconnected due to: ...,
will attempt reconnect`, затем `>>> Reconnected to ...`. Подписка восстановится автоматически без нового nats sub.

В пуле клиент вернётся на другой узел, пока первый выключен. Серверные причины и перенос нагрузки — [Топологии](/learn/topologies).

## Буфер переподключения {#the-reconnect-buffer}

Приложение продолжает публиковать во время разрыва. Что делать с ними?

**Буфер** хранит исходящие публикации RECONNECTING и отправляет по порядку после возврата. Go/Java стандартно 8 МБ — ReconnectBufSize/reconnectBufferSize, Python 2 МБ. Rust использует ограниченную очередь с обратным давлением.

Сначала восстанавливаются подписки, затем отправки. Это не гарантия доставки: Core остаётся не более одного раза, буфер не превращает запись в долговременную с ack.

При заполнении Go/Java/Python отклоняют следующую публикацию, Go — ErrReconnectBufExceeded. Rust ждёт свободного места. Ограничение защищает память; снижайте нагрузку.

Буфер не восстанавливает позицию потребителя JetStream: ею управляет [слой подтверждений](/learn/jetstream/acknowledgment), не соединение.

<div class="nats-flow" data-scenario="reconnectBackoffAnimated" data-width="600" data-height="350"></div>

## Типичные ошибки {#pitfalls}

Что нарушает восстановление:

**Конечный предел прекращает долгую аварию навсегда.** Go/Java/Python 60, JS 10. Для длительных сервисов -1 и наблюдение reconnect error. Rust/C# уже бесконечны.

Подключите журнал каждой попытки:

<div class="nats-example" data-type="learn-resilient-clients-reconnection-handle-reconnect-errors" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

**[Повтор первого входа](#retrying-the-first-connect) скрывает неверный адрес.** Вечный RECONNECTING после развёртывания требует оповещения и журнала. В Go начальные неудачи тоже идут тому же обработчику.

**Нулевая задержка или отсутствие jitter перегружают пул.** Сохраняйте ненулевое ожидание и случайность против синхронного шторма.

**Полный буфер блокирует или отклоняет.** Не повторяйте publish тесным циклом. Снизьте входящий поток, дайте очереди опустеть после восстановления.

**Зависшая связь обнаруживается через минуты.** При PING раз в две минуты, допустимых двух без ответа отказ замечается на третьем — до шести минут. Rust раз в минуту — до трёх. Go отправляет PING независимо от входящего трафика и сбрасывает только PONG; Rust сдвигает интервал любым входящим сообщением. При необходимости уменьшите ping interval и MaxPingsOut, где доступен; Rust фиксирует два. Точные API — у библиотеки.

## Что уже готово {#where-you-are}

Order-svc и клиенты JetStream имеют:

- Обнаружение разрыва и RECONNECTING.
- Повтор первого входа при необходимости.
- Пул с задержками, jitter и неограниченными попытками.
- Автовосстановление подписок и отправку буфера.

События уже возникают; теперь объединим наблюдение и состояние для проверки здоровья.

## Что дальше {#whats-next}

Все переходы и Closed в одном интерфейсе плюс опрос состояния.

Перейдите к [Событиям соединения](/learn/resilient-clients/connection-events).

## См. также {#see-also}

- [Топологии](/learn/topologies) — серверный отказ.
- [JetStream → Подтверждения](/learn/jetstream/acknowledgment) — позиция.
- [Справочник](/reference/) — протокол; reconnect/keepalive в API клиента.
