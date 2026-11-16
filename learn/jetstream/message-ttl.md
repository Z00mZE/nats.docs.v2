---
id: message-ttl
title: "TTL отдельных сообщений"
sidebar_position: 21
description: "Истечение срока одного сообщения раньше MaxAge потока"
---

# TTL отдельных сообщений {#per-message-ttl}

В [Настройке потока](/learn/jetstream/shaping-the-stream) ORDERS получил MaxAge семь дней. Иногда одной записи нужен другой срок.

## Когда удалить раньше {#when-one-message-should-expire-sooner}

orders.canceled может иметь смысл лишь час: сервис должен отреагировать за 60 минут, а не хранить отмену неделю.

MaxAge одинаков для всех и отдельно это не выражает.

**TTL сообщения**, time-to-live, задаёт индивидуальный срок удаления раньше общего.

При публикации заголовок `Nats-TTL` принимает `1h`, `5s`, `30m`. Отсчёт идёт от сохранения.

## Включение на потоке {#the-stream-must-opt-in}

По умолчанию заголовок отклоняется, пока возможность не включена.

Включите `AllowMsgTTL` для ORDERS:

```bash
nats stream edit ORDERS --allow-msg-ttl
```

Проверьте:

```bash
nats stream info ORDERS
```

`Allows Per-Message TTL` станет true:

```
Allows Per-Message TTL: true
```

Два условия:

Включение необратимо; выключить сервер не разрешает.

Нужен сервер 2.11+. На старом поля нет и изменение не действует. Далее предполагается 2.11+.

## Короткоживущее сообщение {#publish-a-short-lived-message}

Опубликуйте отмену со сроком 60 секунд:

<div class="nats-example"
     data-type="learn-jetstream-message-ttl-publishWithTtl"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Обычный PubAck и номер дополняются серверным временем удаления: сохранение плюс минута.

Сразу запись учитывается в `nats stream info ORDERS`, после минуты счётчик уменьшается. Другие записи сохраняют неделю.

## TTL и MaxAge {#how-ttl-and-maxage-interact}

Применяется *раньший* срок.

<div class="nats-flow" data-scenario="messageTtlAnimated" data-width="680" data-height="300"></div>

Для отмены 60 секунд наступают раньше семи дней.

TTL только сокращает MaxAge, кроме следующего исключения.

## Постоянное сообщение {#how-to-make-a-message-permanent}

Определение схемы или базовый снимок может требоваться дольше остальных данных.

`Nats-TTL: never` не истекает даже по MaxAge и остаётся до явного удаления.

## Хранение и доставка {#storage-versus-delivery}

TTL определяет жизнь *сохранённой копии*, не факт чтения.

Непрочитанное и неподтверждённое удаляется по расписанию. Это та же независимость хранения и обработки, что у публикации.

Для уведомления об истечении `SubjectDeleteMarkerTTL` может оставить маркер, но лишь для последнего сообщения темы. При наличии более новых маркера нет. У настройки есть другие условия в [справочнике](/reference/jetstream/api/stream/create).

Срок должен соответствовать полезности и оставлять исправному потребителю время догнать: минутная отмена имеет смысл, только если читатель успевает за минуту.

## Две ошибки публикации {#two-ways-a-ttl-publish-can-fail}

TTL не меньше секунды. Нулевой или дробный меньше секунды отклоняется invalid-TTL, `err_code` 10165; ничего не записано.

Корректный TTL без включения потока даёт TTL-disabled, код 10166, тоже без записи. Различайте причины по PubAck.

Заголовок не игнорируется молча. Для ORDERS без SubjectDeleteMarkerTTL либо срок соблюдён, либо ошибка.

## Типичные ошибки {#pitfalls}

Практические ловушки:

**Без включения публикация не сохраняется даже без TTL.** `per-message TTL is disabled`, код 10166, означает полное отсутствие записи. Заранее проверяйте Allows Per-Message TTL.

<div class="nats-example"
     data-type="learn-jetstream-message-ttl-ttl-on-disabled-stream"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

**Короткий срок удаляет независимо от читателя.** Простой, очередь и даже уже выполняемая обработка не останавливают отсчёт. Рассчитывайте по отставанию самого медленного исправного потребителя и времени полезности.

**AllowMsgTTL нельзя отменить.** Не включайте для временного эксперимента с расчётом выключить обратно.

## Что уже готово {#where-you-are}

AllowMsgTTL включён необратимо. Вы увидели удаление orders.canceled через 60 секунд. Для обычных TTL действует ранний срок TTL/MaxAge.

Прежние сообщения остаются под семидневным [MaxAge](/learn/jetstream/shaping-the-stream).

## Что дальше {#whats-next}

[Политики потоков и потребителей](/learn/jetstream/policies) собирают все варианты перед итогами.

## См. также {#see-also}

- [Заголовки TTL](/reference/jetstream/api/headers) — Nats-TTL и маркеры.
- [Конфигурация потока](/reference/jetstream/api/stream/create) — AllowMsgTTL, SubjectDeleteMarkerTTL.
