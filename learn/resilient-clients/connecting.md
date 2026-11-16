---
id: connecting
title: "Подключение"
sidebar_position: 2
description: "Именованное соединение order-svc, пул, тайм-аут и установление связи"
---

# Подключение {#connecting}

Первый шаг устойчивости — открыть соединение. Одного URL хватало ноутбуку; при эксплуатации именно достижение сервера и аутентификация часто отказывают первыми.

Зададим параметры, имя и несколько серверов и рассмотрим протокол connect. Дальнейшие механизмы будут опираться на эту связь.

## Параметры соединения {#connection-options}

Они задаются при connect на срок соединения. Сначала важны три.

**Имя** order-svc позволяет найти приложение в `nats server report
connections` и журналах вместо анонимного клиента.

**Пул серверов** — допустимые URL. Несколько дают переключение уже при первом подключении, если один недоступен.

Начнём именованным соединением к одному серверу:

<div class="nats-example" data-type="learn-resilient-clients-connecting-basic" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Во всех примерах прежнее событие:

```json
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

## Случайный порядок пула {#the-server-pool-is-randomized}

По умолчанию URL перемешиваются: разные клиенты начинают с разных n1/n2/n3, распределяя нагрузку.

Для намеренного порядка есть NoRandomize, Python dont_randomize, Rust retain_servers_order. Обычно оставляйте случайность против массового наплыва на первый узел.

Подключение к трём адресам:

<div class="nats-example" data-type="learn-resilient-clients-connecting-pool" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Устройство кластера — [Ваш первый кластер](/learn/topologies/your-first-cluster). Здесь это просто доступный пул.

## Обнаруженные серверы {#discovered-servers}

INFO при [установлении связи](#the-connect-handshake) содержит connect_urls соседей, а изменения списка сообщаются весь срок связи. Это **gossip**; клиент добавляет адреса в пул как **обнаруженные**.

Они так же перемешиваются и используются при восстановлении. Настроенные остаются навсегда, обнаруженные могут удалиться после исчезновения объявления. Даже один n1 после INFO даёт n1/n2/n3.

Объединение включено везде. Отключение: Go IgnoreDiscoveredServers, Java ignoreDiscoveredServers(), Rust ignore_discovered_servers, JavaScript ignoreClusterUpdates. Python и C# не отключают. Причина отказа от обнаружения — недостижимые из клиентской сети объявленные адреса.

Сигналы обнаружения: Go DiscoveredServersCB, Python discovered_server_cb, Java DISCOVERED_SERVERS, JavaScript update с добавленными/удалёнными. Rust/C# сигнала нет. Подробнее — [События](/learn/resilient-clients/connection-events).

CLI с --trace выводит `>>> Discovered new servers, known servers are now ...`:

<div class="nats-example" data-type="learn-resilient-clients-connecting-discovered" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

При no_advertise сервер не отправляет connect_urls: останется заданный пул. См. [Топологии](/learn/topologies/your-first-cluster).

## Тайм-аут подключения {#the-connect-timeout-bounds-the-dial}

DNS, TCP и ответ сервера могут зависнуть из-за адреса, межсетевого экрана или перегрузки. Ожидание должно быть ограничено.

**Connect timeout** ограничивает одну попытку до следующего URL. Обычно две секунды, в Rust пять, JavaScript двадцать. Проверьте библиотеку и задайте по сети осознанно.

Пул даёт альтернативы, тайм-аут — время отказа от одной. Недоступный узел стоит один интервал, затем следующий.

Точные клиентские API — в справке библиотеки, серверные параметры — в [справочнике](/reference/).

## Протокол установления связи {#the-connect-handshake}

Параметры выбирают сервер, **handshake** превращает TCP в рабочую NATS-связь.

Четыре шага:

1. **TCP** к выбранному серверу с ограниченным временем.
2. **INFO** сервера: server_id, max_payload, auth_required, tls_required и другое.
3. **CONNECT** клиента: имя, данные входа, возможности; затем PING.
4. **PONG** означает CONNECTED. При отказе -ERR, например Authorization Violation, и закрытие сокета. Verbose также даёт +OK на CONNECT, но обычно выключен.

Схема двух исходов — принятие и отказ:

<div class="nats-flow" data-scenario="connectHandshakeAnimated" data-width="600" data-height="350"></div>

Особенно важны поля:

Auth_required заранее объявляет необходимость данных входа. Без них -ERR до CONNECTED; передача — [TLS и аутентификация](/learn/resilient-clients/tls-and-auth).

Max_payload, стандартно мегабайт, проверяется клиентом до отправки. Слишком большой orders.created отклоняется локально.

## Типичные ошибки {#pitfalls}

Неудача возможна до первой публикации: сервер может принять TCP, но вернуть -ERR maximum connections exceeded. Повтор connect тоже требует задержки.

**Один URL — точка отказа первого входа.** Настройте несколько URL или IP за именем.

**Опора только на discovery ненадёжна.** Оно зависит от объявления и достижимости адресов. Задайте все обязательные серверы, найденные считайте дополнением.

**Долгий dial тормозит запуск.** Явный короткий срок плюс пул ограничивает цену зависшего узла.

**Большое сообщение — ошибка publish, не connect.** Не лечите переподключением. Большой объект храните отдельно с передачей ссылки.

Обрабатывайте неудачный вход у границы приложения:

<div class="nats-example" data-type="learn-resilient-clients-connecting-handle-connect-error" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

## Что уже готово {#where-you-are}

Order-svc имеет:

- Имя.
- Перемешиваемый n1/n2/n3.
- Дополнение из connect_urls.
- Ограничение времени каждой попытки.

Вы знаете TCP → INFO → CONNECT → PONG и значения auth_required/max_payload.

## Что дальше {#whats-next}

[Переподключение](/learn/resilient-clients/reconnection) переживает потерю уже открытого канала с задержками и буфером.

Перейдите к [Переподключению](/learn/resilient-clients/reconnection).

## См. также {#see-also}

- [Ваш первый кластер](/learn/topologies/your-first-cluster) — серверная сторона пула.
- [TLS и аутентификация](/learn/resilient-clients/tls-and-auth) — данные входа.
