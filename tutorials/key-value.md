---
id: key-value
title: "6. Хранение состояния в Key-Value"
sidebar_position: 7
description: "Записывайте и читайте значения, наблюдайте за ними в бакете JetStream Key-Value"
---

# 6. Хранение состояния в Key-Value {#6-store-state-in-key-value}

Вы создадите бакет Key-Value, запишете значение, прочитаете его, а затем включите наблюдение за бакетом во втором терминале, чтобы видеть изменения сразу после их появления. В результате у вас будет небольшое хранилище актуального состояния, доступное для чтения, записи и наблюдения.

## Что понадобится {#what-youll-need}

- Установленные `nats-server` и CLI `nats` (см. [1. Привет, NATS](/tutorials/hello-nats)).
- Бакет Key-Value работает поверх потока JetStream, поэтому на шаге 1 вы запустите сервер с включённым JetStream.

## Шаг 1: запустите сервер с JetStream {#step-1-start-the-server-with-jetstream}

Бакет Key-Value хранится в JetStream, поэтому запустите сервер с флагом `-js`.

```bash
nats-server -js
```

В журнале запуска должна появиться строка, подтверждающая включение JetStream:

```
[INF] Starting JetStream
[INF] Server is ready
```

Оставьте сервер работающим и откройте новый терминал для следующих шагов.

## Шаг 2: создайте бакет {#step-2-create-a-bucket}

Создайте бакет `profiles`. В нём будут храниться ваши значения.

<div class="nats-example" data-type="tutorials-key-value-create-bucket" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Должно появиться подтверждение с конфигурацией бакета:

```
Information for Key-Value Store Bucket profiles created 2026-06-09 10:13:41

Configuration:

           Bucket Name: profiles
          History Kept: 1
                   ...
    Backing Store Kind: JetStream
```

## Шаг 3: запишите и прочитайте значение {#step-3-put-a-value-and-read-it-back}

Сохраните значение по ключу, затем прочитайте его. Ключ — `sue.color`, значение — `blue`.

<div class="nats-example" data-type="tutorials-key-value-put-get" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Операция записи выводит записанное значение, а чтение возвращает полную запись:

```
blue
profiles > sue.color revision: 1 created @ ...

blue
```

Теперь у вас есть одно сохранённое и проверенное значение.

## Шаг 4: наблюдайте за бакетом из второго терминала {#step-4-watch-the-bucket-from-a-second-terminal}

Наблюдение (watch) передаёт каждое изменение бакета по мере его появления. Откройте **второй терминал** и начните наблюдать за `profiles`.

<div class="nats-example" data-type="tutorials-key-value-watch" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Сначала наблюдатель выводит текущее значение, затем ожидает:

```
[2026-06-09 10:14:22] PUT profiles > sue.color: blue
```

Оставьте наблюдение работающим. Вы настроили такую схему: приложение записывает значение, а наблюдатель сразу получает его.

<div class="nats-flow" data-scenario="kvWatchAnimated" data-width="600" data-height="350"></div>

## Шаг 5: обновите значение и проверьте уведомление {#step-5-update-the-value-and-see-the-watch-fire}

Вернитесь в **первый терминал** и запишите новое значение по тому же ключу.

<div class="nats-example" data-type="tutorials-key-value-update" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Операция записи возвращает новое значение:

```
green
```

Переключитесь в терминал наблюдения. Новая строка появляется сразу после изменения:

```
[2026-06-09 10:15:03] PUT profiles > sue.color: green
```

Когда закончите, остановите наблюдение с помощью `Ctrl-C`.

## Что вы создали {#what-you-built}

У вас есть бакет Key-Value с актуальным состоянием: вы записали и прочитали значение, а наблюдатель во втором терминале получал каждое изменение сразу после его появления.

## Дальше {#next}

- Итоговая работа: [7. Создание приложения](/tutorials/build-an-app) — объедините публикацию и подписку, запрос и ответ и поток в одной программе.
- Узнайте, как это работает: [углублённый курс Key-Value](/learn/key-value) объясняет бакеты, ревизии, наблюдение и лежащий в основе поток.
