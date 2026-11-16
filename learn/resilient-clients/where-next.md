---
id: where-next
title: "Куда двигаться дальше"
sidebar_position: 9
description: "Итоги жизненного цикла соединения, связанные главы и контрольный список"
---

# Куда двигаться дальше {#where-next}

В начале у клиентов был один URL без имени и плана отказа. Теперь order-svc использует пул, backoff/jitter, drain, ограничение памяти, безопасные запросы и проверенный TLS с creds.

Нового материала нет: соберём модель и дальнейшие ссылки.

## Основная модель {#the-core-model-in-one-sentence}

Все страницы безопасно переводили один объект — **соединение** — между состояниями.

Это **автомат** DISCONNECTED, CONNECTING, CONNECTED, RECONNECTING, DRAINING, CLOSED. Отказ сервера ведёт к восстановлению, SIGTERM — drain/close, зависший dial ждёт тайм-аут CONNECTING.

Подключение научило CONNECTING → CONNECTED, восстановление — CONNECTED → RECONNECTING → CONNECTED. События сделали переходы наблюдаемыми. Drain — безопасный выход. Медленные потребители ограничили память, request/reply — неудачные ответы, TLS/Auth — защищённый вход.

Шесть механизмов действуют на одном автомате, события делают его видимым. Имена опций и стандарты уточняют эти переходы.

## Где искать подробности {#where-the-details-live}

Версионируемый [справочник](/reference/) описывает протокол, -ERR и сервер. Типы, имена и значения клиентских опций — в API библиотеки.

Здесь лишь поведение при сбоях; полные ошибки сервера и клиентские параметры смотрите соответственно там.

## Связанные главы {#sibling-deep-dives}

За границей клиента материал разделён:

[Топологии](/learn/topologies) объясняют n1/n2/n3, в исходной главе n1-east/n2-east/n3-east, причины отказов и серверный взгляд.

[JetStream](/learn/jetstream) и [Подтверждения](/learn/jetstream/acknowledgment) сохраняют позицию и определяют повторы после восстановленной подписки.

[Безопасность](/learn/security) выпускает загружаемые creds и CA.

[Сервисы](/learn/services) формализуют responder через имена, обнаружение, метрики endpoints и очереди.

[Мониторинг](/learn/monitoring) наблюдает серверные slow_consumers, уведомления и здоровье.

## Что уже готово {#where-you-are}

Прежние order-svc, warehouse, notifications, analytics и потребители продолжают работу с настроенными соединениями. Новых изменений здесь нет.

Соединение — автомат, сбой — переход, настройка управляет им. Это основа эксплуатации клиентов NATS.

## Контрольный список перед эксплуатацией {#production-checklist}

Последняя проверка перед реальными заказами:

### Подключение — см. [Типичные ошибки](/learn/resilient-clients/connecting#pitfalls) {#connecting--see-pitfalls}

- [ ] Несколько URL или IP вместо единственной точки.
- [ ] Обязательные адреса заданы явно; discovery — дополнение при достижимом объявлении.
- [ ] Осознанный connect timeout.
- [ ] Сообщения меньше max_payload, большие данные отдельно; это не ошибка связи.

### Переподключение — см. [Типичные ошибки](/learn/resilient-clients/reconnection#pitfalls) {#reconnection--see-pitfalls}

- [ ] MaxReconnect=-1 для длительных Go/Java/Python/JS; Rust/C# уже бесконечны.
- [ ] Журнал reconnect error.
- [ ] При повторе первого входа тревога на длительный RECONNECTING после развёртывания.
- [ ] Ненулевая задержка и jitter.
- [ ] Обрабатывайте заполнение: стандарт Go/Java 8 МБ, Python 2 МБ; Go ErrReconnectBufExceeded, Rust обратное давление.
- [ ] При необходимости уменьшите PING: стандарт обнаруживает до шести минут, Rust до трёх.

### События — см. [Типичные ошибки](/learn/resilient-clients/connection-events#pitfalls) {#connection-events--see-pitfalls}

- [ ] Опрос для панелей, метрик, readiness; события для реакции.
- [ ] Closed-наблюдатель даже с бесконечными повторами.
- [ ] Отдельные метрики разрывов и async-ошибок.

### Плавное завершение — см. [Типичные ошибки](/learn/resilient-clients/drain-and-shutdown#pitfalls) {#drain--shutdown--see-pitfalls}

- [ ] Drain после остановки производства, иначе гонка и ErrConnectionDraining.
- [ ] Срок длиннее медленного обработчика.
- [ ] Явные ack JetStream до закрытия: drain не управляет позицией.

### Медленные потребители — см. [Типичные ошибки](/learn/resilient-clients/slow-consumers#pitfalls) {#slow-consumers--see-pitfalls}

- [ ] Свои пределы настоящим подпискам; Go 500 000/64 МБ — лишь запасная защита.
- [ ] Расчёт по задержке и пику.
- [ ] Async callback и заметный журнал потерь.
- [ ] Различайте локальный drop и серверный disconnect.

### Request/reply — см. [Типичные ошибки](/learn/resilient-clients/request-reply-resilience#pitfalls) {#request-reply-resilience--see-pitfalls}

- [ ] Тайм-аут в два-три p99 отвечающего.
- [ ] Отдельные реакции на no responders и тайм-аут.
- [ ] Идемпотентность order_id с устранением дублей.
- [ ] Предел попыток и jitter.

### TLS и аутентификация — см. [Типичные ошибки](/learn/resilient-clients/tls-and-auth#pitfalls) {#tls--auth--see-pitfalls}

- [ ] Creds из файла/окружения, вне git.
- [ ] Всегда проверяйте CA.
- [ ] Продлевайте JWT до срока и наблюдайте auth-ошибки: сервер закрывает живое соединение, повторный отказ может завершить клиент.
- [ ] Ротация новым соединением с drain старого.

## См. также {#see-also}

- [Справочник](/reference/) — протокол, -ERR, сервер.
- [Топологии](/learn/topologies) — устройство пула.
- [Безопасность](/learn/security) — выпуск creds и CA.
