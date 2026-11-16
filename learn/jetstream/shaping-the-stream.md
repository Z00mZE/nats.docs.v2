---
id: shaping-the-stream
title: "Настройка потока"
sidebar_position: 13
description: "Ограничения размера и возраста потока и поведение при достижении предела"
---

# Настройка потока {#shaping-the-stream}

Созданный на странице [Ваш первый поток](/learn/jetstream/your-first-stream) ORDERS не ограничен и сохраняет всё. Для обучения это допустимо, для эксплуатации — нет.

Без ограничений он заполнит диск и может остановить сервер.

**Предел** определяет заполнение, **политика Discard** — что выбросить: новую запись или старейшую.

## Ограничения {#the-limit}

Стандартная политика **Limits** сохраняет до достижения одного из пределов:

- **MaxAge** — максимальный возраст. Семь дней удаляют сообщение примерно через неделю; удобно для недавних событий.
- **MaxBytes** — объём хранения. Один гигабайт ограничивает размер независимо от возраста и защищает сервер.
- **MaxMsgs** — число сообщений. При миллионе следующая запись требует вытеснения; удобно, если важен счётчик.

Все действуют независимо и одновременно: срабатывает первый достигнутый. Задайте нужные, остальные оставьте неограниченными.

MaxAge удаляет по часам, MaxMsgs — по количеству:

<div class="nats-flow" data-scenario="maxAgeAnimated" data-width="620" data-height="200"></div>

<div class="nats-flow" data-scenario="maxMsgsAnimated" data-width="520" data-height="200"></div>

## Ограничьте ORDERS {#cap-the-orders-stream}

Задайте семь дней и гигабайт через `nats stream edit`. Поток меняется на месте с сохранением данных, укладывающихся в пределы.

<div class="nats-example"
     data-type="learn-jetstream-shaping-the-stream-setLimits"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Команда показывает изменения и запрашивает подтверждение. Затем проверьте:

```bash
nats stream info ORDERS
```

Вместо unlimited появятся пределы:

```text
Options:

                    Retention: Limits
              Acknowledgments: true
               Discard Policy: Old
             Duplicate Window: 2m0s

Limits:

             Maximum Messages: unlimited
          Maximum Per Subject: unlimited
                Maximum Bytes: 1.0 GiB
                  Maximum Age: 7d0h0m0s
         Maximum Message Size: unlimited
            Maximum Consumers: unlimited
```

`Maximum Messages` остаётся `unlimited`. `Maximum Message Size` ограничивает отдельное сообщение, не весь поток, и тоже не задан. Теперь поток не превышает гигабайт и не хранит старше недели.

## Политика Discard {#the-discard-policy}

При новой записи за пределами выбирается одно из двух поведений.

**Discard Old**, стандартное, удаляет старейшие сообщения ради новых. Публикация успешна, самая новая запись сохраняется.

<div class="nats-flow" data-scenario="discardOldAnimated" data-width="540" data-height="250"></div>

**Discard New** отклоняет новую публикацию при MaxMsgs, MaxBytes или соответствующем ограничении темы, сохраняя прежние данные. MaxAge независимо удаляет по времени при любой политике. **Первый достигнутый предел действует.**

<div class="nats-flow" data-scenario="discardNewAnimated" data-width="540" data-height="250"></div>

Для живого ORDERS нужна недавняя неделя, поэтому оставим Discard Old: при нехватке места важнее сегодняшний заказ.

Discard New подходит, если старые данные нельзя терять и лучше замедлить издателя. Он обязан обрабатывать отказы.

## Ограничения относятся к потоку {#limits-apply-to-the-stream-not-the-consumer}

Удалённое пределом сообщение исчезает для всех потребителей.

Позиция shipping и фильтр analytics не защищают от удаления. Если читатель отстал до истечения возраста, данные потеряны. Далее рассмотрим влияние политики хранения.

## Ограничения отдельных тем {#per-subject-limits}

`MaxMsgsPerSubject` может хранить, например, последние сто сообщений каждой темы под orders.>, независимо от общего количества.

Все ограничения — в [Конфигурации потока](/reference/jetstream/api/stream/create). Здесь используются MaxAge, MaxBytes и Discard.

## Типичные ошибки {#pitfalls}

Две основные ловушки:

**Discard Old удаляет без предупреждения издателя.** Успешная запись может вытеснить старый заказ. Для сохранения истории выбирайте Discard New с ошибками `maximum bytes
exceeded` или `maximum messages exceeded`. Но MaxAge продолжает действовать: поднимите или уберите и его.

<div class="nats-example"
     data-type="learn-jetstream-shaping-the-stream-discardNew"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Семидневный MaxAge не гарантирует неделю истории: при всплеске MaxBytes может удалить данные нескольких часов. Рассчитывайте объём по пиковой, не средней нагрузке.

**Общие пределы не балансируют темы.** Поток orders.created может вытеснить orders.shipped. Для отдельной квоты задайте MaxMsgsPerSubject:

<div class="nats-example"
     data-type="learn-jetstream-shaping-the-stream-perSubjectLimit"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

При Discard Old удаляется старейшее своей темы. Сам Discard New это не меняет: для отказа по заполненной теме дополнительно нужен `DiscardNewPerSubject`, поле `discard_new_per_subject`. Тогда возвращается `maximum messages per
subject exceeded` наряду с общими ошибками. См. [Конфигурацию потока](/reference/jetstream/api/stream/create).

## Что уже готово {#where-you-are}

Теперь есть:

- ORDERS с MaxAge семь дней и MaxBytes 1 ГиБ.
- Прежние сообщения, укладывающиеся в пределы.
- Discard Old для вытеснения старейших, а не новых.

## Что дальше {#whats-next}

Пределы настроены для Limits. Теперь выберем саму политику хранения: Limits, Interest или WorkQueue.

## См. также {#see-also}

- [Конфигурация потока](/reference/jetstream/api/stream/create) — типы, диапазоны и значения ограничений.
