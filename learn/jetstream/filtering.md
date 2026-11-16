---
id: filtering
title: "Фильтрация сообщений"
sidebar_position: 5
description: "Второй потребитель только для orders.shipped и независимые представления потока"
---

# Фильтрация сообщений {#filtering-what-you-consume}

`billing` читает весь `ORDERS` без фильтра.

Отчётности нужны лишь отправленные заказы. Доставка `orders.created` и `orders.canceled` была бы лишней работой обеим сторонам.

Добавим потребителя только для `orders.shipped` и покажем независимость читателей.

## Действие фильтра {#what-a-filter-does}

**Фильтр** — шаблон темы потребителя. Он получает лишь соответствующие сообщения, пропуская остальные.

Допустимы точное имя `orders.shipped` и подстановочные знаки: `orders.*` охватывает все события. `*` и `>` работают как в [Core-подписке](/learn/core-nats/subjects-and-wildcards).

Поток по-прежнему захватывает `orders.>`. Фильтр относится к потребителю и выбирает из уже сохранённого.

Создайте `analytics` с `orders.shipped`:

<div class="nats-example"
     data-type="learn-jetstream-filtering-createFiltered"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Новый `--filter` задаёт одну тему фильтра: `analytics` получает `orders.shipped`, но не `orders.created` и `orders.canceled`.

Запросите описание:

```bash
nats consumer info ORDERS analytics
```

Появилась новая строка конфигурации:

```
Configuration:

                Name: analytics
           Pull Mode: true
      Filter Subject: orders.shipped
      Deliver Policy: All
          Ack Policy: Explicit
            Ack Wait: 30.00s
       Replay Policy: Instant
     Max Ack Pending: 1,000
   Max Waiting Pulls: 512
```

`Filter Subject: orders.shipped` определяет выборку. У `billing` этой строки нет — он читает все темы.

## Два потребителя с разными позициями {#two-consumers-with-separate-positions}

`analytics` и `billing` читают один поток с независимыми позициями.

Курсор отслеживает доставленные и подтверждённые номера. Он принадлежит потребителю; два потребителя имеют два курсора.

Сервер хранит курсор с конфигурацией и подтверждениями отдельно от сообщений. Продвижение `analytics` за номер `3` не двигает `billing`.

<div class="nats-flow" data-scenario="twoConsumersAnimated" data-width="640" data-height="300"></div>

`billing` проходит все заказы, `analytics` — только отправленные. Позиции могут различаться и не влияют друг на друга.

Запросите сообщения `analytics`:

```bash
nats consumer next ORDERS analytics --count 5
```

Придёт лишь `orders.shipped` с номером `3` со страницы публикации. `orders.created` под `1` и `2` остаются в потоке, но скрыты фильтром.

`billing` остался на прежнем месте. Чтение `analytics` не сдвинуло его и не удалило данные.

## Потребитель — представление {#a-consumer-is-a-view}

Это независимое **представление** сохранённых сообщений со своими фильтром, курсором и подтверждениями. Общая копия данных одна.

Добавление `analytics` требует одной команды, не копирует данные и не замедляет `billing`. Потребитель может запускаться, останавливаться и отставать независимо. Сервер обслуживает все представления из одних сообщений.

В [группе очереди Core NATS](/learn/core-nats/queue-groups) обработчики делят живой трафик. Здесь каждый потребитель получает собственное полное представление по фильтру. Деление работы *внутри* одного потребителя — [пул обработчиков](/learn/jetstream/worker-pool) далее.

## Другие варианты фильтрации {#other-filtering-options}

Потребитель может иметь несколько фильтров одновременно, но сценарию достаточно одного.

Все варианты описаны в [Создании потребителя](/reference/jetstream/api/consumer/create). Здесь используется один `Filter Subject`.

## Типичные ошибки {#pitfalls}

Неверный фильтр может отказать незаметно.

**Фильтр без совпадений.** Опечатка `orders.shiped` создаёт допустимого, но ничего не получающего потребителя без предупреждений. Пустой ответ не доказывает пустоту потока. Проверьте фактически сохраняемые темы.

<div class="nats-example"
     data-type="learn-jetstream-filtering-filterMatchesNothing"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

При пустом запросе сравните `Filter Subject` в `nats consumer info` с темами потока. За пределами `orders.>` совпадений не будет.

**Ожидание удаления данных фильтром.** Он сужает одно представление, не очищает поток. После чтения `analytics` все события доступны `billing`. Хранение задают ограничения потока из [Настройки потока](/learn/jetstream/shaping-the-stream).

**Пересечения фильтров.** *Между* потребителями Limits и Interest они допустимы: каждый получает свою полную выборку. Исключение — WorkQueue, где фильтры потребителей не пересекаются; см. [Политики хранения](/learn/jetstream/retention-policies).

*Внутри* одного потребителя несколько фильтров допустимы, но полное покрытие одного другим — `orders.>` и `orders.shipped` — вызывает `consumer subject filters cannot overlap`. Частичное пересечение без покрытия принимается.

## Что уже готово {#where-you-are}

Теперь ORDERS читают:

- `billing` — все события без фильтра.
- `analytics` — только `orders.shipped`.

Они используют одни сообщения, не влияют на позиции друг друга и не меняют поток чтением.

## Что дальше {#whats-next}

Пока всё успешно: запрос, обработка, ack. Далее рассмотрим неподтверждённые сообщения, двойное подтверждение и повторную доставку.

## См. также {#see-also}

- [Справочник → Создание потребителя](/reference/jetstream/api/consumer/create) — настройки, включая несколько фильтров.
- [Чтение потока](/learn/jetstream/reading-back) — серверный курсор.
