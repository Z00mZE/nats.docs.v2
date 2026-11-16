---
id: build-an-app
title: "7. Итоговая работа: небольшое приложение NATS"
sidebar_position: 8
description: "Объедините публикацию и подписку, запрос и ответ и поток в одном работающем приложении"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 7. Итоговая работа: небольшое приложение NATS {#7-capstone-build-a-small-nats-app}

Это итоговая работа: небольшое приложение, которое объединяет всё из предыдущих руководств. Оно подключается к NATS, публикует события заказов в поток JetStream и отвечает на запрос о числе учтённых заказов. Запустите его и посмотрите, как вместе работают три шаблона: публикация и подписка, запрос и ответ и поток, сохраняющий ваши сообщения.

## Что понадобится {#what-youll-need}

- Установленные `nats-server` и CLI `nats` ([Руководство 1: Привет, NATS](/tutorials/hello-nats)).
- Среда выполнения языка, выбранного во вкладке клиента (Go, Node.js, Python и другие).
- Около 15 минут. Понадобятся три терминала.

## Шаг 1: запустите сервер JetStream {#step-1-start-a-jetstream-server}

В первом терминале запустите сервер с включённым JetStream, чтобы он мог сохранять поток:

```bash
nats-server -js
```

В журнале запуска должна быть строка с упоминанием JetStream:

```
[INF] Starting nats-server
[INF] Starting JetStream
[INF] Server is ready
```

Оставьте этот терминал работающим.

## Шаг 2: создайте поток {#step-2-create-the-stream}

Откройте второй терминал. Создайте поток `ORDERS`, сохраняющий все сообщения, опубликованные в темы, соответствующие `orders.>`:

<div class="nats-example" data-type="tutorials-build-an-app-create-stream" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Должно появиться подтверждение с описанием нового потока:

```
Stream ORDERS was created

Subjects: orders.>
 Storage: File
```

## Шаг 3: напишите и запустите приложение {#step-3-write-and-run-the-app}

Теперь напишите само приложение. Оно подключается к NATS, публикует в поток три события заказа, затем подписывается на `app.orders.count` и отвечает на запросы текущим числом опубликованных заказов. Тема запросов намеренно находится за пределами `orders.>`: запрос в тему из `orders.>` сохранился бы в потоке, и подтверждение сохранения от потока пришло бы раньше ответа приложения.

Сохраните код для выбранного языка в одном файле, затем установите зависимости и запустите его во втором терминале:

<Tabs groupId="lang">
<TabItem value="go" label="Go" default>

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

func main() {
	// Подключиться к серверу, запущенному на шаге 1.
	nc, _ := nats.Connect(nats.DefaultURL)
	defer nc.Drain()

	js, _ := jetstream.New(nc)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Опубликовать три события заказов в поток ORDERS.
	orders := []string{"orders.created", "orders.created", "orders.shipped"}
	for _, subject := range orders {
		js.Publish(ctx, subject, []byte("event"))
	}
	count := len(orders)
	fmt.Printf("published %d order events\n", count)

	// Отвечать на запросы app.orders.count текущим общим количеством.
	nc.Subscribe("app.orders.count", func(msg *nats.Msg) {
		msg.Respond([]byte(fmt.Sprintf("%d orders", count)))
	})

	fmt.Println("ready: send a request to app.orders.count")
	select {} // keep running so it can answer requests
}
```

Сохраните код как `main.go`, затем настройте модуль и запустите:

```bash
go mod init orders-app
go get github.com/nats-io/nats.go
go run main.go
```

</TabItem>
<TabItem value="js" label="JavaScript/TypeScript">

```javascript
import { connect } from "@nats-io/transport-node";
import { jetstream } from "@nats-io/jetstream";

(async () => {
  // Подключиться к серверу, запущенному на шаге 1.
  const nc = await connect({ servers: "nats://localhost:4222" });
  const js = jetstream(nc);

  // Опубликовать три события заказов в поток ORDERS.
  const orders = ["orders.created", "orders.created", "orders.shipped"];
  for (const subject of orders) {
    await js.publish(subject, "event");
  }
  const count = orders.length;
  console.log(`published ${count} order events`);

  // Отвечать на запросы app.orders.count текущим общим количеством.
  nc.subscribe("app.orders.count", {
    callback: (_err, msg) => {
      msg.respond(`${count} orders`);
    },
  });

  console.log("ready: send a request to app.orders.count");

  // Продолжить работу, чтобы отвечать на запросы.
  await nc.closed();
})();
```

Сохраните код как `app.mjs` (расширение `.mjs` включает синтаксис `import`), затем установите зависимости и запустите:

```bash
npm install @nats-io/transport-node @nats-io/jetstream
node app.mjs
```

</TabItem>
</Tabs>

Приложение должно вывести ход выполнения и перейти в ожидание:

```
published 3 order events
ready: send a request to app.orders.count
```

Оставьте приложение работающим.

## Шаг 4: убедитесь, что события попали в поток {#step-4-confirm-the-events-landed-in-the-stream}

Откройте третий терминал. Прочитайте сообщения, сохранённые приложением в потоке `ORDERS`:

<div class="nats-example" data-type="tutorials-build-an-app-view-stream" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Вы должны увидеть три опубликованных события заказа, каждое в своей теме:

```
[1] Subject: orders.created
[2] Subject: orders.created
[3] Subject: orders.shipped
```

Теперь события находятся в потоке и готовы к чтению потребителем:

<div class="nats-flow" data-scenario="jetStreamConsumersAnimated" data-width="600" data-height="350"></div>

## Шаг 5: задайте приложению вопрос {#step-5-ask-the-app-a-question}

В том же третьем терминале отправьте приложению запрос в тему `app.orders.count`:

<div class="nats-example" data-type="tutorials-build-an-app-call-app" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Вы должны сразу получить ответ приложения:

```
3 orders
```

Готово: приложение ответило на запрос числом опубликованных им заказов.

## Что вы создали {#what-you-built}

Одно приложение, которое подключается к NATS, публикует события заказов в долговременный поток и отвечает на запрос текущим вычисленным итогом. Публикация и подписка, JetStream и запрос-ответ работают вместе в одной программе.

## Дальше {#next}

Вы завершили практические руководства. Чтобы понять, *почему* каждый компонент работает именно так, переходите к углублённым курсам:

- Темы, публикация и подписка, запрос и ответ: [углублённый курс Core NATS](/learn/core-nats)
- Потоки, потребители и подтверждения: [углублённый курс JetStream](/learn/jetstream)
