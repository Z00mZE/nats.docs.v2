---
id: index
title: "Подробно об устойчивых клиентах"
sidebar_position: 1
description: "Соединение как автомат состояний, обнаруживающий сбои, буферизующий работу и восстанавливающийся"
---

# Подробно об устойчивых клиентах {#resilient-clients-deep-dive}

Core NATS научил pub/sub на локальном сервере. Теперь рассмотрим отказ сервера, зависшую сеть и отставание обработчика.

Основное средство — настроенное **соединение**. Устойчивый клиент обнаруживает разрыв, буферизует работу, восстанавливается и завершает процесс без потери незавершённого.

Общая модель — **автомат состояний**: DISCONNECTED, CONNECTING, CONNECTED, RECONNECTING, DRAINING, CLOSED. Отказ переводит CONNECTED в RECONNECTING, штатное завершение — в DRAINING и CLOSED. Каждый механизм — переход автомата.

Защищаем знакомую Acme ORDERS: код order-svc, warehouse, notifications, analytics прежний, меняются их соединения. Во всех примерах одно событие:

```json
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

## Результат {#by-the-end-youll-have}

- Именованное order-svc с **пулом серверов** и осознанным временем подключения.
- Переподключение по n1/n2/n3 с backoff и jitter и отправкой буферизованных публикаций после возврата.
- Все события в одном месте и состояние в readiness: различение временного разрыва и окончательного закрытия.
- Плавное завершение по SIGTERM.
- Ограниченные очереди подписок и асинхронный сигнал отставания до OOM.
- Различение отсутствующего и медленного отвечающего и безопасные повторы запросов.
- Учётные данные order-svc и TLS с проверкой CA.

## Для кого эта глава {#who-this-is-for}

Вы знакомы с [Core NATS](/learn/core-nats), желательно [JetStream](/learn/jetstream). ORDERS и его потребители используются повторно.

Опыт эксплуатации не нужен: начинаем с правильного connect и добавляем по одному сбою.

Отдельного введения Core Concepts нет. Модель вводит [Жизненный цикл соединения](/learn/core-nats/connection-lifecycle); здесь углубление до эксплуатации. Каждый новый термин определяется по месту.

## Как читать {#how-to-read-it}

Одна связь order-svc проходит [подключение](/learn/resilient-clients/connecting), [восстановление](/learn/resilient-clients/reconnection), [события](/learn/resilient-clients/connection-events), [плавное завершение](/learn/resilient-clients/drain-and-shutdown) и другие настройки.

Глава посвящена клиенту. Причины серверного отказа — [Топологии](/learn/topologies), состояние подтверждений — [JetStream](/learn/jetstream/acknowledgment), выпуск данных входа — [Безопасность](/learn/security).

Имена и значения клиентских параметров смотрите в API библиотеки. [Справочник](/reference/) описывает протокол и сервер, здесь только важные при сбоях настройки.

## Карта главы {#map}

| Страница | Содержание |
|---|---|
| Устойчивые клиенты | Автомат соединения и сбои |
| [Подключение](/learn/resilient-clients/connecting) | Имя, пул, тайм-аут и протокол |
| [Переподключение](/learn/resilient-clients/reconnection) | Backoff, jitter, первый вход, буфер |
| [События](/learn/resilient-clients/connection-events) | Наблюдение и проверки состояния |
| [Плавное завершение](/learn/resilient-clients/drain-and-shutdown) | Drain соединения и подписки, flush |
| [Медленные потребители](/learn/resilient-clients/slow-consumers) | Пределы очереди и переполнение |
| [Устойчивость request/reply](/learn/resilient-clients/request-reply-resilience) | No responders, тайм-аут и безопасные повторы |
| [TLS и аутентификация](/learn/resilient-clients/tls-and-auth) | Creds, CA и постоянные ошибки входа |
| [Куда двигаться дальше](/learn/resilient-clients/where-next) | Проверки и дальнейшие темы |

## Предварительные условия {#prerequisites}

Понадобятся:

- nats-server; для переподключений три узла из [Топологий](/learn/topologies), здесь сокращённые n1/n2/n3 вместо n1-east/n2-east/n3-east.
- CLI nats. Недоступные CLI пределы и обработчики показаны вызовами библиотек.

Запустите сервер и перейдите к [Подключению](/learn/resilient-clients/connecting).

## См. также {#see-also}

- [Core NATS](/learn/core-nats) — исходные операции.
- [JetStream](/learn/jetstream) — поток и потребители.
- [Топологии](/learn/topologies) — кластер для пула.
