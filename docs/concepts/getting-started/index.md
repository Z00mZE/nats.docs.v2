---
id: index
title: "Начало работы"
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Начало работы с NATS {#getting-started-with-nats}

Начните работать с NATS за несколько минут. Это руководство поможет установить NATS, выполнить базовую настройку и создать первое приложение.

## Установка {#installation}

### Быстрый запуск с Docker {#quick-start-with-docker}

Самый быстрый способ запустить NATS:

```
docker run -p 4222:4222 -p 8222:8222 nats:latest
```

Эта команда запускает сервер NATS со следующими портами:
- 4222 для клиентских соединений
- 8222 для HTTP-мониторинга

### Установка сервера NATS {#install-nats-server}

#### macOS {#macos}
```
brew install nats-server
```

#### Linux {#linux}
```
curl -sf https://binaries.nats.dev/nats-io/nats-server/v2@latest | sh
sudo mv nats-server /usr/local/bin/
```

#### Windows {#windows}
Скачайте последний выпуск со страницы [GitHub Releases](https://github.com/nats-io/nats-server/releases).

### Проверка установки {#verify-installation}

```
nats-server --version
```

## Запуск сервера NATS {#start-nats-server}

### Обычный сервер {#basic-server}
```
nats-server
```

### С мониторингом {#with-monitoring}
```
nats-server -m 8222
```

Откройте http://localhost:8222, чтобы посмотреть метрики сервера.

### С JetStream (долговременное хранение) {#with-jetstream-persistence}
```
nats-server -js
```

## Установка NATS CLI {#install-nats-cli}

Инструмент командной строки NATS CLI позволяет взаимодействовать с NATS:

```
# macOS
brew install nats-io/nats-tools/nats

# Linux
curl -sf https://binaries.nats.dev/nats-io/natscli/nats@latest | sh
sudo mv nats /usr/local/bin/
```

## Первое приложение NATS {#your-first-nats-application}

### Использование CLI {#using-the-cli}

```
# Подписаться на тему
nats sub hello &

# Опубликовать сообщение
nats pub hello "Hello NATS!"
```

### Установка клиентских библиотек {#install-client-libraries}

<Tabs groupId="lang">
<TabItem value="cli" label="CLI" default>

```bash
# NATS CLI уже установлен: см. выше
# Его можно сразу использовать для публикации и подписки
```

</TabItem>
<TabItem value="js" label="JavaScript/TypeScript">

```bash
npm install nats
```

</TabItem>
<TabItem value="go" label="Go">

```bash
go get github.com/nats-io/nats.go
```

</TabItem>
<TabItem value="java" label="Java">

Gradle
```groovy
dependencies {
  implementation 'io.nats:jnats:2.25.2'
}
```

Maven
```xml
<dependency>
    <groupId>io.nats</groupId>
    <artifactId>jnats</artifactId>
    <version>2.25.2</version>
</dependency>
```

</TabItem>
<TabItem value="rust" label="Rust">

```toml title="Cargo.toml"
[dependencies]
async-nats = "0.47.0"
tokio = { version = "1", features = ["full"] }
```

</TabItem>
<TabItem value="csharp" label="C#/.NET">

```bash
dotnet add package NATS.Net
```

Последняя версия указана на странице [NATS.Net в NuGet](https://www.nuget.org/packages/NATS.Net).

</TabItem>
</Tabs>

### Пример издателя {#publisher-example}

<div class="nats-example" data-type="getting-started-publish" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

### Пример подписчика {#subscriber-example}

<div class="nats-example" data-type="getting-started-subscribe" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

### Запуск примеров {#running-the-examples}

<Tabs groupId="lang">
<TabItem value="cli" label="CLI" default>

```bash
# Терминал 1: запустите подписчика
nats sub hello

# Терминал 2: опубликуйте сообщения
nats pub hello "Hello NATS!"
nats pub hello "Welcome to messaging"

# Схема запрос–ответ
# Терминал 1: запустите отвечающий сервис
nats reply hello "Hi there!"

# Терминал 2: отправьте запрос
nats request hello "Anyone there?" --timeout=2s
```

</TabItem>
<TabItem value="js" label="JavaScript/TypeScript">

```bash
# Терминал 1: запустите подписчика
node subscribe.js

# Терминал 2: запустите издателя
node publish.js
```

</TabItem>
<TabItem value="go" label="Go">

```bash
# Терминал 1: запустите подписчика
go run subscribe.go

# Терминал 2: запустите издателя
go run publish.go
```

</TabItem>
<TabItem value="java" label="Java">

```text
It's best to run the examples from your IDE or 
command line where Java is installed.

Clone https://github.com/nats-io/nats.java
and navigate to src/main/java/io/nats/examples/natsIoDoc
```


</TabItem>
<TabItem value="rust" label="Rust">

```bash
# Терминал 1: запустите подписчика
cargo run --bin subscribe

# Терминал 2: запустите издателя
cargo run --bin publish
```

</TabItem>
<TabItem value="csharp" label="C#/.NET">

```text
It's best to run the examples from your IDE or
command line where the .NET SDK is installed.

Clone https://github.com/nats-io/nats.net
and navigate to examples/Example.NatsIODocs
```

</TabItem>
</Tabs>

## Следующие шаги {#next-steps}

Поздравляем! Вы успешно:
- ✅ Установили сервер NATS
- ✅ Опубликовали сообщения и подписались на их получение
- ✅ Создали первое приложение NATS

### Что изучить дальше: {#what-to-explore-next}

- [Углублённое изучение Core NATS](/learn/core-nats) — практическое знакомство с основами
- [Углублённое изучение JetStream](/learn/jetstream) — долговременное хранение и потоковая передача
- [Раздел «Изучение» целиком](/learn) — последовательные практические главы
- [Шаблон запрос-ответ](../request-reply.md) — синхронное взаимодействие
- [Темы](../subjects.md) — обмен сообщениями на основе тем

### Клиентские библиотеки {#client-libraries}

Официальные клиенты NATS доступны для:
- [Go](https://github.com/nats-io/nats.go)
- [Java](https://github.com/nats-io/nats.java)
- [JavaScript/TypeScript](https://github.com/nats-io/nats.js)
- [Python](https://github.com/nats-io/nats.py)
- [Rust](https://github.com/nats-io/nats.rs)
- [C](https://github.com/nats-io/nats.c)
- [.NET](https://github.com/nats-io/nats.net)

### Ресурсы {#resources}

- [NATS by Example](https://natsbyexample.com) — интерактивные примеры
- [Сообщество в Slack](https://slack.nats.io) — помощь участников сообщества