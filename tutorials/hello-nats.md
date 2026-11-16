---
id: hello-nats
title: "1. Привет, NATS"
sidebar_position: 2
description: "Установите NATS, затем опубликуйте и получите первое сообщение"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 1. Привет, NATS {#1-hello-nats}

В этом руководстве вы установите NATS, запустите сервер и отправите первое сообщение. В одном терминале подпишетесь на **тему**, из другого опубликуете в неё сообщение и увидите его получение. В результате на вашем компьютере будет работающий сервер NATS, через который вы передадите сообщение как из CLI, так и с помощью клиента.

## Что понадобится {#what-youll-need}

- Терминал с возможностью открыть две или три вкладки
- Разрешение на установку программ (Homebrew, скачивание или Docker)
- Около десяти минут

## Шаг 1: установите сервер NATS и CLI {#step-1-install-the-nats-server-and-cli}

Установите `nats-server` (сервер) и `nats` (клиент командной строки).

<Tabs groupId="install-os">
<TabItem value="macos" label="macOS (Homebrew)" default>

```bash
brew install nats-server
brew install nats-io/nats-tools/nats
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
# Сервер: устанавливает nats-server в /usr/local/bin и запрашивает sudo
curl -sf https://binaries.nats.dev/nats-io/nats-server/v2@latest | PREFIX=/usr/local/bin sh

# CLI: устанавливает nats в /usr/local/bin
curl -sf https://binaries.nats.dev/nats-io/natscli/nats@latest | PREFIX=/usr/local/bin sh
```

</TabItem>
<TabItem value="docker" label="Docker">

```bash
# Вместо установки запустите сервер в Docker. Он работает на переднем
# плане и выводит "[INF] Server is ready"; оставьте его работать.
# Сервер уже запущен, поэтому пропустите шаг 2 ниже.
docker run -p 4222:4222 nats:latest

# В другом терминале установите CLI на свою машину: пример для macOS
brew install nats-io/nats-tools/nats
```

</TabItem>
</Tabs>

Проверьте установку CLI:

```bash
nats --version
```

Вы должны увидеть номер версии, например `nats version 0.4.0`. Если сервер установлен напрямую (через Homebrew или скрипт Linux, а не Docker), проверьте и его — ожидается строка вида `nats-server: v2.11.0`:

```bash
nats-server --version
```

## Шаг 2: запустите сервер {#step-2-start-the-server}

Если на первом шаге вы запустили сервер через Docker, он уже работает. Оставьте тот терминал открытым и переходите к шагу 3.

В остальных случаях запустите сервер в первом терминале:

```bash
nats-server
```

Вы должны увидеть журнал запуска, заканчивающийся строками:

```
[INF] Server is ready
```

Теперь сервер принимает соединения на `localhost:4222`. Оставьте его работающим до конца руководства.

## Шаг 3: подпишитесь на тему {#step-3-subscribe-to-a-subject}

Откройте **второй терминал**. Подписчик регистрирует интерес к теме и получает копию каждого подходящего сообщения. Подпишитесь на тему `greet`:

<div class="nats-example" data-type="tutorials-hello-nats-subscribe" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Подписчик должен запуститься и перейти в ожидание:

```
17:42:01 Subscribing on greet
```

Оставьте этот терминал работающим и ожидающим сообщения.

## Шаг 4: опубликуйте сообщение {#step-4-publish-a-message}

Откройте **третий терминал**. Издатель отправляет сообщение в тему. Опубликуйте `Hello NATS!` в `greet`:

<div class="nats-example" data-type="tutorials-hello-nats-publish" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

В третьем терминале должно появиться подтверждение публикации:

```
17:42:09 Published 11 bytes to "greet"
```

Теперь вернитесь ко **второму терминалу**. Подписчик получил сообщение и вывел его:

```
[#1] Received on "greet"
Hello NATS!
```

Сообщение прошло весь путь: публикация в тему, сопоставление с интересом подписчика и доставка.

## Шаг 5: посмотрите на передачу сообщений {#step-5-see-the-flow}

Анимация показывает только что выполненный путь от публикации до подписчика:

<div class="nats-flow" data-scenario="publishSubscribeAnimated" data-width="600" data-height="350"></div>

Опубликуйте ещё несколько сообщений из третьего терминала и посмотрите на счётчик во втором: `[#2]`, `[#3]` и так далее. Каждая публикация доставляет новую копию всем активным подписчикам темы.

## Что вы создали {#what-you-built}

У вас работает сервер NATS, и вы отправили через него первое сообщение: один терминал подписался на тему `greet`, другой опубликовал в неё сообщение, и оно было доставлено. Такой же pub/sub работает из любого клиента NATS, как показано во вкладках с кодом выше.

## Дальше {#next}

- Создайте отвечающий сервис, к которому можно обратиться и получить ответ: [Запрос-ответ](/tutorials/request-reply).
- Разберитесь, как устроены публикация и подписка (граф интереса, гарантии доставки и подстановочные символы): [углублённый курс Core NATS](/learn/core-nats) или более краткое [введение в публикацию и подписку](/concepts/pub-sub-basics).
