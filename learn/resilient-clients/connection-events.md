---
id: connection-events
title: "События соединения"
sidebar_position: 4
description: "Наблюдение автомата соединения и состояния для проверки готовности"
---

# События соединения {#connection-events}

Disconnect, reconnect и reconnect error уже сообщали потерю, возврат и неудачные попытки — переходы одного автомата.

Соберём события, добавим окончательное closed и опрос состояния для здоровья. Две идеи — события и опрос.

## События {#the-events-a-connection-reports}

**Событие соединения** сообщает переход или сведения о кластере. Шесть основных:

- **Disconnect** — потеря и RECONNECTING; см. [Переподключение](/learn/resilient-clients/reconnection).
- **Reconnect** — возврат CONNECTED.
- **Reconnect error** — неудачная попытка, работа продолжается.
- **Closed** — окончательная остановка.
- **Discovered servers** — изменение пула; см. [Обнаружение](/learn/resilient-clients/connecting#discovered-servers).
- **Lame duck** — сервер скоро завершится; см. [Плавное завершение](/learn/resilient-clients/drain-and-shutdown).

Три события — переходы, reconnect error повторяется внутри RECONNECTING:

```
CONNECTED ──disconnect──▶ RECONNECTING ──reconnect──▶ CONNECTED
    │                          │ reconnect error, per failed attempt
    │ Close() by the app       └──retries spent──▶ CLOSED
    └─────────────────────────────────────────────▶ CLOSED
```

Closed приходит один раз последним. Discovery и lame duck приходят на исправной связи и не являются переходами сами.

## API клиентов {#how-each-client-delivers-the-events}

Формы доставки различаются:

| Клиент | Механизм | Настройка |
|---|---|---|
| Go | callback каждого вида | `DisconnectErrHandler`, `ReconnectHandler`, `ReconnectErrHandler`, `ClosedHandler`, `DiscoveredServersHandler`, `LameDuckModeHandler` |
| Python | coroutine callbacks | `disconnected_cb`, `reconnected_cb`, `closed_cb`, `discovered_server_cb`, `lame_duck_mode_cb` |
| Java | listener с enum | `connectionListener(...)`, `Events`: `DISCONNECTED`, `RECONNECTED`, `RESUBSCRIBED`, `DISCOVERED_SERVERS`, `LAME_DUCK`, `CONNECTED`, `CLOSED` |
| JavaScript | async iterator | `nc.status()`, типы `disconnect`, `reconnect`, `reconnecting`, `update`, `ldm`, `close` |
| Rust | async callback enum | `event_callback(...)`, `Event`: `Connected`, `Disconnected`, `LameDuckMode`, `Draining`, `Closed` |
| C# | события .NET | `ConnectionDisconnected`, `ConnectionOpened`, `ReconnectFailed`, `LameDuckModeActivated` |

Rust и C# обновляют пул без сигнала discovery. В C# нет closed-события: смотрите ConnectionState. JavaScript update содержит добавления и удаления.

Подключите журналирование. CLI уже регистрирует обработчики:

<div class="nats-example" data-type="learn-resilient-clients-connection-events-watch-events" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

## Разрыв и закрытие {#disconnected-versus-closed}

Только эта развилка требует разного действия приложения.

Disconnect восстанавливается: журналируйте, считайте метрику и дайте циклу работать.

Closed окончателен: публикации больше не пройдут. Нужен выход с перезапуском супервизором либо оповещение.

Наблюдатель закрытия: Go ClosedHandler, Python closed_cb, Java CLOSED, Rust Event::Closed. JavaScript `nc.closed()` возвращает promise, разрешающийся причиной ошибки, никогда не reject; main может ждать его. C# — ConnectionState.

Даже MaxReconnect=-1 не исключает Closed: Close, завершение drain и постоянные ошибки. Go, например, прерывает после одинаковой ошибки входа дважды, кроме IgnoreAuthErrorAbort. См. [TLS и аутентификацию](/learn/resilient-clients/tls-and-auth).

Остальные события журналируются, Closed требует выхода или тревоги.

## Опрос состояния {#polling-the-connection-state}

События отправляют переходы; **опрос** отвечает о текущем:

- Go Status(): DISCONNECTED, CONNECTED, CLOSED, RECONNECTING, CONNECTING, DRAINING_SUBS, DRAINING_PUBS; также IsConnected/IsReconnecting/IsClosed.
- Python is_connected, is_reconnecting, is_closed, is_draining.
- Java getStatus(): DISCONNECTED, CONNECTED, CLOSED, RECONNECTING, CONNECTING.
- Rust connection_state(): Pending, Connected, Disconnected.
- C# ConnectionState: Closed, Open, Connecting, Reconnecting, Failed.
- JavaScript только isClosed/isDraining, остальное отслеживается status и closed.

Снимок мгновенно устаревает: между CONNECTED и publish возможен разрыв, который обслужит буфер. Не запускайте восстановление по опросу — это дублирует упорядоченные события с гонками. Опрос для отчёта, события для реакции.

Go StatusChanged() также даёт канал переходов для select; стандартно CONNECTED, RECONNECTING, DISCONNECTED, CLOSED.

## Проверка готовности order-svc {#a-readiness-check-for-order-svc}

Проверка оркестратора или балансировщика должна отражать:

- **Готов** при CONNECTED.
- **Не готов** при RECONNECTING, но процесс работает и восстанавливается. Перезапуск потеряет буфер.
- **Остановлен** при CLOSED: наблюдатель завершает процесс для замены.

Внешний `nats
server check connection` измеряет connect, RTT и pub/sub, сравнивая warning/critical. Коды Nagios: 0/1/2/3 — OK/warning/critical/unknown. Format: nagios/json/prometheus/text. Это доступность пула, не состояние вашего процесса; последнее читается внутри:

<div class="nats-example" data-type="learn-resilient-clients-connection-events-health-check" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

## Принудительное переподключение {#force-reconnect}

**Force reconnect** намеренно запускает обычный путь с тем же пулом, задержками и событиями.

После обновления кластера клиенты могут скопиться на самом долго работавшем узле. Переподключение части экземпляров перераспределяет их.

API различаются:

- Go ForceReconnect() не ждёт; при текущем восстановлении пропускает задержку.
- Java forceReconnect(), также ForceReconnectOptions.
- Python force_reconnect() действует только из подключённого состояния.
- Rust force_reconnect().
- C# ReconnectAsync() запускает без ожидания завершения.
- JavaScript экспериментальный reconnect(): отказ при closed/draining, без действия при disconnected; setServers() заменяет пул перед ним.

Это настоящий разрыв с обычными рисками. JavaScript предупреждает об отказе незавершённых запросов. Буфер ограничен. Не запускайте массово: разнесите во времени против всплеска.

## Типичные ошибки {#pitfalls}

Ошибки наблюдения:

**Опрос как триггер гоняется с автоматом.** IsConnected перед publish и ручное восстановление по RECONNECTING быстро устаревают. Опрос — панели, метрики, readiness; реакция — события.

**Нет closed-наблюдателя.** Процесс может выглядеть здоровым с навсегда мёртвым каналом после последнего disconnect. Регистрируйте даже с бесконечными повторами:

<div class="nats-example" data-type="learn-resilient-clients-connection-events-handle-closed" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

**События и async errors разные.** ErrorHandler Go, error_cb Python, ErrorListener Java сообщают проблемы *при CONNECTED*, например [отставание подписки](/learn/resilient-clients/slow-consumers). JavaScript/Rust объединяют канал с разными типами. Считайте отдельно: разрывы указывают на сеть/сервер, async — на приложение.

## Что уже готово {#where-you-are}

Наблюдаемая связь имеет:

- Журнал переходов и сведений, действие по Closed.
- Наблюдатель окончательного отказа.
- Readiness по опросу, реакцию по событиям.
- Принудительное переподключение для перераспределения.

Теперь осталось намеренно выполнить чистый выход.

## Что дальше {#whats-next}

Drain завершает доставки и отправки до Close при SIGTERM; далее также контекст lame duck.

Перейдите к [Плавному завершению](/learn/resilient-clients/drain-and-shutdown).

## См. также {#see-also}

- [Переподключение](/learn/resilient-clients/reconnection) — цикл.
- [Мониторинг](/learn/monitoring) — серверный взгляд.
- [Справочник](/reference/) — протокол; API событий в библиотечной документации.
