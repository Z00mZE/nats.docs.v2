---
id: your-first-stream
title: "Ваш первый поток"
sidebar_position: 2
description: "Зачем нужен поток: создание ORDERS и изучение конфигурации"
---

# Ваш первый поток {#your-first-stream}

Здесь мы создадим `ORDERS` одной командой CLI, затем рассмотрим его другой.

## Зачем нужен поток {#why-a-stream}

Пример главы — небольшой интернет-магазин Acme `ORDERS`. Каждое событие заказа появляется сообщением в [теме](/concepts/subjects):

- `orders.created` — поступил заказ.
- `orders.shipped` — заказ отправлен со склада.
- `orders.canceled` — заказ отменён.

Сервисы реагируют на сообщения:

- Склад упаковывает заказ при `orders.created`.
- Уведомления отправляют письмо при `orders.shipped`.
- Аналитика считает все события.

Core NATS теряет сообщения, если никто их не слушает. **Поток** сохраняет их: это серверное хранилище сообщений выбранных тем. Их можно прочитать снова через минуты или месяц.

## Предварительные условия {#prerequisites}

Нужен `nats-server` с JetStream. Если его ещё нет:

```bash
nats-server -js
```

Флаг `-js` включает JetStream. Без него следующая команда не сработает.

## Создайте поток {#create-the-stream}

В другом терминале:

<div class="nats-example" data-type="learn-jetstream-your-first-stream-create" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

В команде важны две части.

Первая — **имя потока** `ORDERS`. Регистр учитывается. Точки, `*`, `>`, пробелы и косые черты запрещены, поэтому `orders.created` не подходит. Имя встретится во всех командах и ошибках главы.

Вторая — сохраняемые **темы** `orders.>`, фильтр с [подстановочным знаком](/concepts/subjects#wildcards). Подходят все темы под `orders.`: `orders.created`, `orders.shipped`, `orders.canceled` и будущая `orders.refunded` без изменения потока.

`--defaults` отключает вопросы остальных настроек. Сервер заполняет стандартные значения; скоро мы их рассмотрим. Пока они подходят.

Вывод должен завершиться примерно так:

```text
Stream ORDERS was created
```

Ошибка `no responders available for request` означает, что сервер запущен без `-js`: JetStream не отвечает. Перезапустите с флагом и повторите.

## Проверка созданного потока {#checking-the-created-stream}

Посмотрите результат:

<div class="nats-example" data-type="learn-jetstream-your-first-stream-info" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Вывод состоит из двух частей.

**Конфигурация** содержит заданные и стандартные значения: заголовок, разделы `Options` и `Limits`:

```text
Information for Stream ORDERS

                     Subjects: orders.>
                     Replicas: 1
                      Storage: File

Options:

                    Retention: Limits
              Acknowledgments: true
               Discard Policy: Old
             Duplicate Window: 2m0s

Limits:

             Maximum Messages: unlimited
          Maximum Per Subject: unlimited
                Maximum Bytes: unlimited
                  Maximum Age: unlimited
         Maximum Message Size: unlimited
            Maximum Consumers: unlimited
```

В `Options` также есть `Direct Get` и переключатели `Allows …`. CLI по умолчанию включает прямое чтение, библиотеки — только по явной настройке. Здесь строки сокращены; возможности будут разобраны далее.

**Состояние** показывает текущее содержимое:

```text
State:

                     Messages: 0
                        Bytes: 0 B
               First Sequence: 0
                Last Sequence: 0
             Active Consumers: 0
```

Новый поток пуст: ноль сообщений и байтов, нет потребителей. Первое сообщение получит номер `1`.

## Значения по умолчанию {#the-defaults}

Вы не задавали перечисленные параметры. Сервер заполнил их стандартными значениями для незаданных полей. Их смысл:

- **Replicas: 1**. Одна копия на одном сервере; его отказ делает поток недоступным. Для ноутбука подходит, для эксплуатации рискованно. См. [Отказ узла](/learn/jetstream/surviving-node-loss).
- **Storage: File**. Запись на диск. Память быстрее, но теряется при перезапуске.
- **Retention: Limits**. Хранение до ограничений размера, возраста или количества. `Interest` и `WorkQueue` удаляют сообщения по мере обработки потребителями; см. [Политики хранения](/learn/jetstream/retention-policies).
- **Discard Policy: Old**. При достижении предела удаляются старые сообщения. Вариант `New` отклоняет новые.
- **Maximum Messages / Bytes / Age / Message Size: unlimited**. Верхних пределов нет. При эксплуатации задавайте хотя бы один; см. [Настройка потока](/learn/jetstream/shaping-the-stream).
- **Duplicate Window: 2m0s**. Две минуты после записи сервер не сохраняет повтор с тем же заголовком [`Nats-Msg-Id`](/reference/jetstream/api/headers). Это позволяет повторить публикацию без второй копии. См. [Публикация](/learn/jetstream/publishing).

Все настройки перечислены в [Справочнике → Создание потока](/reference/jetstream/api/stream/create). Здесь используются стандартные.

## Тема привязывается только к одному потоку {#subjects-bind-to-exactly-one-stream}

Одну тему может сохранять только один поток. Создание второго с пересечением `orders.>` отклоняется:

```bash
nats stream add ARCHIVE --subjects "orders.*" --defaults
```

```text
nats: error: could not create Stream: subjects overlap with an existing stream (10065)
```

Проверяется любое пересечение: `orders.*` и даже одна `orders.created` тоже конфликтуют с `ORDERS`.

Так JetStream всегда однозначно определяет поток для поступившего сообщения.

Для перекрывающихся данных существуют **зеркала** и **источники**. Зеркало копирует другой поток, источники собирают несколько в один. Здесь они пока не нужны. [Зеркала и источники](/learn/jetstream/mirrors-and-sources) создают оба варианта, а [Справочник → Создание потока](/reference/jetstream/api/stream/create) описывает `mirror` и `sources`.

## Типичные ошибки {#pitfalls}

При создании первого потока учтите следующее.

**Неограниченные значения допускают бесконечный рост.** С `--defaults` ограничения `Maximum
Messages`, `Maximum Bytes` и `Maximum Age` равны `unlimited`. ORDERS растёт до заполнения диска, что может остановить сервер. Для обучения это допустимо, но рабочему потоку нужен хотя бы один предел. Его настройка разобрана в [Настройке потока](/learn/jetstream/shaping-the-stream); здесь границы намеренно не заданы.

**Имя потока постоянно.** Переименования нет: у `nats stream edit` отсутствует `--name`, изменение имени отклоняется с `stream configuration name must match
original`. Удаление и пересоздание теряет сообщения. Выбирайте имя заранее. При необходимости перехода безопаснее создать новый поток с новыми темами, оставив старый до естественного удаления данных.

## Что уже готово {#where-you-are}

Теперь у вас есть:

- Поток `ORDERS` для `orders.>`.
- Ноль сообщений.
- Конфигурация со стандартными значениями.

Следующая страница, [Публикация](/learn/jetstream/publishing), отправляет первые сообщения и показывает ответ сервера.

## См. также {#see-also}

- [Справочник → Создание потока](/reference/jetstream/api/stream/create) — все настройки и диапазоны.
- [Справочник → API JetStream](/reference/jetstream/api/) — операции потоков и потребителей.
