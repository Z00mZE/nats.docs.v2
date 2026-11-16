---
id: your-first-mqtt-client
title: "Первый клиент MQTT"
sidebar_position: 2
description: "Включение mqtt на локальном сервере, публикация датчика и получение показания в NATS"
---

# Первый клиент MQTT {#your-first-mqtt-client}

Датчики холодовой цепи Acme используют неизменяемый MQTT, платформа ORDERS — NATS. Объединим их на сервере: датчик публикует температуру, а `nats sub` получает обычное сообщение NATS.

Нужны JetStream для состояния MQTT и блок `mqtt {}`, открывающий порт устройств.

## MQTT хранит состояние в JetStream {#mqtt-stores-its-state-in-jetstream}

Подписки сеанса, неподтверждённые сообщения QoS 1 и 2 и retained-сообщения должны переживать соединение. Сервер сохраняет их в потоках JetStream, поэтому JetStream должен быть доступен.

На отдельном сервере он должен быть включён локально. Блок `mqtt {}` без JetStream препятствует запуску:

```
mqtt requires JetStream to be enabled if running in standalone mode
```

Ошибка относится к автономному режиму. С конфигурацией `cluster`, `gateway` или `leafnode` сервер может обращаться к JetStream в другой части системы, поэтому эта проверка не применяется. В главе JetStream всегда локальный.

После включения сервер сам создаёт необходимые потоки. Управлять ими не нужно; они рассматриваются в разделе [QoS, сеансы и retained-сообщения](/learn/mqtt/qos-sessions-and-retained).

## Включение MQTT {#enable-mqtt}

Нужны два блока: `jetstream` для состояния и `mqtt` для слушателя.

```conf
# mqtt-server.conf — one server serving both NATS clients and MQTT devices
listen: 127.0.0.1:4222

jetstream {
  store_dir: "./js/mqtt-server"
}

mqtt {
  listen: 127.0.0.1:1883
}
```

MQTT использует отдельный стандартный порт 1883, но сервер не выбирает его автоматически. Без `listen` или `port` блок `mqtt {}` молча отключает MQTT, без ошибки и строки журнала. Всегда задавайте порт. Клиентский 4222, кластерные и листовые порты остаются отдельными; NATS-клиентам ничего знать о MQTT не нужно.

Запустите сервер:

```bash
nats-server -c mqtt-server.conf
```

Журнал подтверждает работу слушателя:

```
[INF] Listening for MQTT clients on mqtt://127.0.0.1:1883
```

Пока нет `authorization`, устройства подключаются без учётных данных. Это подходит локальному примеру, но не эксплуатации. Раздел [Аутентификация и кластеризация](/learn/mqtt/auth-and-clustering) добавляет защиту.

TLS, тайм-ауты, число реплик и остальные поля находятся в [Справочник → mqtt](/reference/config/mqtt/). Следующие страницы показывают наблюдаемое влияние основных настроек.

## Публикация датчика и получение в NATS {#publish-from-a-sensor-receive-on-nats}

Сначала подпишитесь в NATS, чтобы зарегистрировать интерес до показания. В одном терминале:

```bash
nats sub "sensors.>"
```

В другом опубликуйте через MQTT, как датчик:

```bash
mosquitto_pub -h 127.0.0.1 -p 1883 \
  -t "sensors/warehouse/cold-1/temp" \
  -m "4.2"
```

Подписчик NATS получает:

```
[#1] Received on "sensors.warehouse.cold-1.temp"
Nmqtt-Pub: 0

4.2
```

Устройство отправило в `sensors/warehouse/cold-1/temp`, подписчик получил `sensors.warehouse.cold-1.temp`. Сервер заменил каждый `/` на `.`, не изменяя полезную нагрузку: в обоих протоколах это байты. Заголовок `Nmqtt-Pub` обозначает источник MQTT и QoS публикации; подписчик может прочитать или игнорировать его.

Сторона NATS не знает о MQTT: `nats sub` использовал обычную подстановку и получил обычное сообщение. Подписчик, поток JetStream или сервис обрабатывают такой трафик одинаково.

<div class="nats-flow" data-scenario="mqttBridgeAnimated" data-width="640" data-height="460"></div>

## Публикация NATS и получение устройством {#publish-from-nats-receive-on-the-device}

Мост двусторонний. Диспетчерская Acme отправляет команды грузовикам через тот же сервер.

Подпишитесь через MQTT как бортовой блок:

```bash
mosquitto_sub -h 127.0.0.1 -p 1883 \
  -t "fleet/truck-17/telemetry" -v
```

Опубликуйте из NATS:

```bash
nats pub fleet.truck-17.telemetry "reroute to depot 4"
```

Устройство получает:

```
fleet/truck-17/telemetry reroute to depot 4
```

Преобразование доставки обратное: тема `fleet.truck-17.telemetry` соответствует подписке устройства `fleet/truck-17/telemetry`.

Сообщение NATS всегда приходит MQTT-подписчику с QoS 0, независимо от запрошенного QoS подписки. Публикация NATS не несёт QoS для повышения уровня. Последствия описаны в разделе [QoS, сеансы и retained-сообщения](/learn/mqtt/qos-sessions-and-retained).

## Как сервер обрабатывает подписку {#what-the-server-does-with-a-subscription}

Подписка устройства на `fleet/truck-17/telemetry` создаёт настоящую подписку NATS на `fleet.truck-17.telemetry`. Мост реализован подпиской, а не отдельным случаем публикации.

Поэтому интерес распространяется как любой другой. Издатель на другом сервере кластера достигает устройства, не зная о MQTT. Обратное также верно: MQTT-публикация становится NATS-публикацией в преобразованной теме и поступает всем подходящим подписчикам.

## Куда поступают показания {#where-the-readings-go}

Это обычный трафик NATS, поэтому существующие приложения Acme обрабатывают и сохраняют его привычным образом.

JetStream уже включён: для захвата обоих деревьев тем достаточно команды:

```bash
nats stream add DEVICES \
  --subjects "sensors.>,fleet.>" \
  --storage file \
  --retention limits \
  --max-age 720h \
  --defaults
```

Теперь показания, телеметрия и команды NATS сохраняются 30 дней. ORDERS использует `DEVICES` как обычный поток: температурное отклонение отмечает заказ соответствующей отправки, телеметрия обновляет положение. Потребители, фильтры и воспроизведение работают по модели [JetStream](/learn/jetstream).

Устройства не меняются и продолжают MQTT. Показание QoS 0 исчезает после доставки, QoS 1 доступно лишь существующим тогда подписчикам. Сохранённое в `DEVICES` показание прочитает и потребитель, написанный в следующем месяце.

## Подводные камни {#pitfalls}

Большинство первых неудач связано с двумя причинами.

**Запуск без JetStream.** Сервер с `mqtt {}` без `jetstream` завершает запуск с `mqtt requires JetStream to be
enabled if running in standalone mode`. Требование действует и для учётной записи: MQTT-пользователю без JetStream отказывают при подключении. Включите JetStream на сервере и в учётной записи пользователей MQTT.

**MQTT поверх WebSocket направлен на 1883.** Ему нужен порт `websocket {}`, а не MQTT. Рукопожатие на 1883 отклоняется сообщением `MQTT clients over websocket must
connect to the Websocket port, not the MQTT port`. Обычный MQTT идёт на 1883, MQTT через WebSocket — на слушатель WebSocket.

## Текущее состояние {#where-you-are}

Один `nats-server` выполняет две задачи:

- NATS-клиенты подключены к 4222, устройства MQTT — к 1883.
- JetStream хранит состояние MQTT под управлением сервера.
- Показание `sensors/warehouse/cold-1/temp` приходит через `nats sub "sensors.>"` как `sensors.warehouse.cold-1.temp`.
- Грузовик на `fleet/truck-17/telemetry` получает публикации NATS в `fleet.truck-17.telemetry`.
- `DEVICES` сохраняет `sensors.>` и `fleet.>`, передавая данные платформе ORDERS.

Оставьте сервер и поток: следующие страницы продолжают работу с ними.

## Что дальше {#whats-next}

Здесь темы были простыми. Реальные устройства используют начальные косые черты, пустые уровни и подстановки, а некоторые символы нельзя преобразовать. Полные правила приведены в разделе [Темы MQTT и NATS](/learn/mqtt/topics-and-subjects).

## См. также {#see-also}

- [Справочник → mqtt](/reference/config/mqtt/) — все поля `mqtt {}`.
- [Core NATS → Публикация и подписка](/learn/core-nats/publish-subscribe) — сторона NATS этого примера.
- [Углублённый курс JetStream](/learn/jetstream) — хранение состояния MQTT.
