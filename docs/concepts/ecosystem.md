---
id: ecosystem
title: "Экосистема NATS"
---

# Экосистема NATS {#the-nats-ecosystem}

NATS — это не только исполняемый файл `nats-server`. Его дополняют официально поддерживаемые клиенты, библиотеки расширений, инструменты командной строки и Kubernetes, средства управления идентификационными данными и интеграции.

Эта страница — карта экосистемы: назначение каждого репозитория, кто его поддерживает и с чего начать.

Если вы хотите просто выбрать клиент и начать разработку, перейдите к [клиентам Tier 1](#tier-1-clients).

## Сервер {#server}

Единый исполняемый файл выполняет всю маршрутизацию сообщений. Кластеризация, долговременное хранение JetStream, листовые узлы, [MQTT](/learn/mqtt/) и [WebSocket](/learn/websocket/) включаются в конфигурации того же `nats-server`: устанавливать отдельные компоненты не нужно.

| Название | Описание |
|---|---|
| [nats-server](https://github.com/nats-io/nats-server) | Сам сервер NATS |

## Клиенты {#clients}

Клиенты NATS делятся на три категории: **Tier 1** (поддерживаются Synadia и реализуют новые возможности к выпуску сервера), **Tier 2** (поддерживаются Synadia, но могут отставать в поддержке новых возможностей) и **клиенты сообщества** (сторонние реализации).

### Клиенты Tier 1 — следуют за выпусками сервера {#tier-1-clients}

Эти клиенты команда NATS обновляет в первую очередь при появлении новых возможностей сервера. Если для вашего языка есть клиент Tier 1, предпочтите его.

| Язык | Репозиторий | Описание |
|---|---|---|
| Go | [nats-io/nats.go](https://github.com/nats-io/nats.go) | Эталонная реализация |
| JavaScript / TypeScript | [nats-io/nats.js](https://github.com/nats-io/nats.js) | Node, Deno, Bun, браузер ([WebSocket](/learn/websocket/)). Заменяет архивные `nats.node`, `nats.deno`, `nats.ws`, `nats.ts` |
| Python | [nats-io/nats.py](https://github.com/nats-io/nats.py) | На основе asyncio, только Python 3 |
| Java | [nats-io/nats.java](https://github.com/nats-io/nats.java) | JVM; доступен из Kotlin и Scala |
| Rust | [nats-io/nats.rs](https://github.com/nats-io/nats.rs) | Крейт `async-nats` |
| C# / .NET | [nats-io/nats.net](https://github.com/nats-io/nats.net) | .NET 6+. Современный асинхронный клиент |
| C | [nats-io/nats.c](https://github.com/nats-io/nats.c) | Встраиваемые системы и приложения, использующие FFI |

### Клиенты Tier 2 — поддерживаются Synadia, возможна задержка новых функций {#tier-2-clients--synadia-maintained-feature-lag-possible}

Эти клиенты поддерживаются Synadia, но появление каждой новой возможности сервера в день выпуска не гарантируется. Реализованные функции готовы к промышленной эксплуатации; актуальное покрытие возможностей смотрите в README соответствующего репозитория.

| Язык | Репозиторий | Описание |
|---|---|---|
| Zig | [nats-io/nats.zig](https://github.com/nats-io/nats.zig) | Недавнее пополнение |
| Swift | [nats-io/nats.swift](https://github.com/nats-io/nats.swift) | iOS, macOS и серверный Swift |
| Ruby | [nats-io/nats-pure.rb](https://github.com/nats-io/nats-pure.rb) | На чистом Ruby — предпочтительный клиент для Ruby |
| Ruby (устаревший) | [nats-io/nats.rb](https://github.com/nats-io/nats.rb) | На основе EventMachine; для нового кода используйте `nats-pure.rb` |
| Elixir | [nats-io/nats.ex](https://github.com/nats-io/nats.ex) | Заменяет архивный `elixir-nats` |

### Клиенты сообщества {#community-clients}

Сторонние реализации существуют, в частности, для Crystal, Dart, Kotlin и PHP. Покрытие возможностей и состояние поддержки различаются — оценивайте каждый проект отдельно. Эта документация не рассматривает клиенты сообщества.

## Orbit — расширения и экспериментальные возможности для каждого языка {#orbit--extensions-and-incubator-per-language}

Репозитории Orbit находятся в организации [synadia-io](https://github.com/synadia-io). Они содержат необязательные высокоуровневые утилиты и экспериментальные возможности поверх соответствующего клиента Tier 1. Подключайте только нужные модули.

В Orbit обычно входят дополнительные инструменты JetStream (запрос нескольких ответов, пакетная публикация, отложенные сообщения), секционированные группы потребителей, кодирование KV и кодеки, распределённые счётчики, утилиты повторных попыток и тестирования отказов. Удачные подходы со временем могут войти в основной клиент. Набор модулей зависит от языка — сверяйтесь с README репозитория Orbit.

| Язык | Репозиторий | Описание |
|---|---|---|
| Go | [synadia-io/orbit.go](https://github.com/synadia-io/orbit.go) | Расширения для `nats.go` |
| JavaScript / TypeScript | [synadia-io/orbit.js](https://github.com/synadia-io/orbit.js) | Расширения для `nats.js` |
| Python | [synadia-io/orbit.py](https://github.com/synadia-io/orbit.py) | Расширения для `nats.py` |
| Java | [synadia-io/orbit.java](https://github.com/synadia-io/orbit.java) | Расширения для `nats.java` |
| Rust | [synadia-io/orbit.rs](https://github.com/synadia-io/orbit.rs) | Расширения для `async-nats` |
| C# / .NET | [synadia-io/orbit.net](https://github.com/synadia-io/orbit.net) | Расширения для `nats.net` |
| C | [synadia-io/orbit.c](https://github.com/synadia-io/orbit.c) | Расширения для `nats.c` |

## Инструменты командной строки {#command-line-tooling}

| Название | Описание |
|---|---|
| [natscli](https://github.com/nats-io/natscli) | CLI `nats` для повседневной работы: публикация, подписка, управление потоками и потребителями, проверка работающего сервера, управление операторами, учётными записями и пользователями через `nats auth`. Используется в большинстве примеров документации |
| [nats-top](https://github.com/nats-io/nats-top) | Просмотр активности сервера в реальном времени в стиле `top` |
| [nats-box](https://github.com/nats-io/nats-box) | Образ контейнера с распространёнными утилитами NATS (`nats`, `nsc`, `nk`) для временных рабочих оболочек в Kubernetes |

## Идентификационные данные и аутентификация {#identity--authentication}

Инструменты и библиотеки для управления операторами, учётными записями, пользователями и ключами подписи с помощью NKeys и JWT.

| Название | Описание |
|---|---|
| [nsc](https://github.com/nats-io/nsc) | Отдельный CLI для управления операторами, учётными записями и пользователями. Альтернатива командам `nats auth`, встроенным в CLI `nats`; использует то же хранилище на диске и поддерживает операции, которых пока нет в `nats auth` |
| [synadia-io/jwt-auth-builder.go](https://github.com/synadia-io/jwt-auth-builder.go) | Программное создание учётных записей и пользователей (альтернатива вызову `nsc` из кода) |
| [synadia-io/callout.go](https://github.com/synadia-io/callout.go) | Go SDK для написания сервисов auth callout |
| [synadia-io/callout.net](https://github.com/synadia-io/callout.net) | .NET SDK для написания сервисов auth callout |

### Библиотеки NKey {#nkey-libraries}

Реализации базовых операций подписи и работы с ключами NKey для разных языков.

| Язык | Репозиторий |
|---|---|
| Go | [nats-io/nkeys](https://github.com/nats-io/nkeys) |
| JavaScript / TypeScript | [nats-io/nkeys.js](https://github.com/nats-io/nkeys.js) |
| Java | [nats-io/nkeys.java](https://github.com/nats-io/nkeys.java) |
| C# / .NET | [nats-io/nkeys.net](https://github.com/nats-io/nkeys.net) |
| Python | [nats-io/nkeys.py](https://github.com/nats-io/nkeys.py) |
| Ruby | [nats-io/nkeys.rb](https://github.com/nats-io/nkeys.rb) |
| Swift | [nats-io/nkeys.swift](https://github.com/nats-io/nkeys.swift) |
| Elixir | [nats-io/nkeys.ex](https://github.com/nats-io/nkeys.ex) |

### Библиотеки JWT {#jwt-libraries}

Реализации выпуска и проверки утверждений JWT учётных записей и пользователей NATS для разных языков.

| Язык | Репозиторий |
|---|---|
| Go | [nats-io/jwt](https://github.com/nats-io/jwt) |
| JavaScript / TypeScript | [nats-io/jwt.js](https://github.com/nats-io/jwt.js) |
| Java | [nats-io/jwt.java](https://github.com/nats-io/jwt.java) |
| C# / .NET | [nats-io/jwt.net](https://github.com/nats-io/jwt.net) |

## Kubernetes {#kubernetes}

| Название | Описание |
|---|---|
| [k8s](https://github.com/nats-io/k8s) | Официальные Helm-чарты для развёртывания кластеров `nats-server`, surveyor и связанных компонентов |
| [nack](https://github.com/nats-io/nack) | Контроллеры Kubernetes и CRD для декларативного управления потоками и потребителями JetStream, хранилищами KV и Object Store |

## Наблюдаемость {#observability}

| Название | Описание |
|---|---|
| [prometheus-nats-exporter](https://github.com/nats-io/prometheus-nats-exporter) | Экспортёр Prometheus для `varz`, `connz`, `routez` и статистики JetStream |
| [nats-surveyor](https://github.com/nats-io/nats-surveyor) | Мониторинг всего кластера: собирает статистику с серверов и предоставляет её в виде метрик Prometheus. В сочетании с экспортёром обеспечивает наблюдаемость всего кластера |

## Схемы и определения API {#schemas--api-definitions}

| Название | Описание |
|---|---|
| [jsm.go](https://github.com/nats-io/jsm.go) | Канонический источник JSON-схем API JetStream, используемых инструментами и справочником этого сайта. Также содержит библиотеку управления JetStream на Go (альтернативу `nats.go` с другим API) |

## Мосты и интеграции {#bridges--integrations}

| Название | Описание |
|---|---|
| [nats-kafka](https://github.com/nats-io/nats-kafka) | Мост Kafka ↔ NATS |
| [nats-spark-connector](https://github.com/nats-io/nats-spark-connector) | Источник для структурированной потоковой обработки Apache Spark |
| [synadia-io/flink-connector-nats](https://github.com/synadia-io/flink-connector-nats) | Коннектор Apache Flink |
| [nats-java-vertx-client](https://github.com/nats-io/nats-java-vertx-client) | Интеграция с Vert.x |
| [terraform-provider-jetstream](https://github.com/nats-io/terraform-provider-jetstream) | Управление ресурсами JetStream как инфраструктурой в коде (IaC) |

## Следующие шаги {#next-steps}

- [Углублённые курсы раздела «Изучение»](/learn) — последовательная практическая работа с NATS
- [Устойчивые клиенты](/learn/resilient-clients) — переподключения и обработка сбоев
- [Сервисы](/learn/services) — микросервисы на основе запроса и ответа
