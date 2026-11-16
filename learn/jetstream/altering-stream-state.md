---
id: altering-stream-state
title: "Изменение состояния потока"
sidebar_position: 15
description: "Ручное удаление сообщения или очистка и влияние на порядковые номера"
---

# Изменение состояния потока {#altering-stream-state}

Пределы удаляют автоматически, но иногда нужно убрать ошибочную запись издателя или очистить данные перед новым тестом вручную.

Есть удаление одного сообщения и массовая очистка. Оба сохраняют конфигурацию, потребителей и нумерацию. Разберём поведение номеров.

## Удаление одного сообщения {#delete-one-message}

Укажите номер, полученный в PubAck:

<div class="nats-example"
     data-type="learn-jetstream-altering-stream-state-deleteMessage"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

`rmm` означает remove message. Команда спрашивает `Really remove message 2 from Stream
ORDERS`; `--force` пропускает вопрос в скрипте.

CLI безопасно перезаписывает байты, чтобы прежнее содержимое, например случайно сохранённый номер карты, нельзя было прочитать.

<div class="nats-flow" data-scenario="deleteMessageAnimated" data-width="780" data-height="270"></div>

Библиотеки дают выбор: `DeleteMsg(seq)` дёшево помечает удаление, оставляя байты до перезаписи; `SecureDeleteMsg(seq)` сразу перезаписывает и медленнее. Различие — `no_erase` запроса; см. [справочник](/reference/jetstream/api/stream/msg-delete).

## Очистка потока {#purge-the-stream}

Для всех сообщений:

<div class="nats-example"
     data-type="learn-jetstream-altering-stream-state-purge"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Вывод `Purged N messages from ORDERS` сообщает количество. Есть подтверждение и `--force`. Имя, конфигурация и потребители остаются. `nats stream rm ORDERS`, напротив, удаляет весь объект вместе с ними.

<div class="nats-flow" data-scenario="purgeStreamAnimated" data-width="780" data-height="270"></div>

Три флага сужают очистку:

<div class="nats-example"
     data-type="learn-jetstream-altering-stream-state-purgeFiltered"
     data-languages="cli,js,go,python,java,rust,csharp,c"></div>

`--subject` выбирает тему, `--seq` удаляет старше номера, `--keep` сохраняет заданное число последних. Последние два несовместимы друг с другом, но каждый сочетается с темой.

## Номера не заполняют пробелы {#sequence-numbers-never-backfill}

Удалённый 2 оставляет 1 и 3 прежними. Перенумерации и повторного использования нет.

Как обещала [публикация](/learn/jetstream/publishing), номера только растут. После полной очистки следующий не 1, а прежний последний плюс один: первый номер пустого потока устанавливается за последним.

<div class="nats-flow" data-scenario="sequenceGapAnimated" data-width="780" data-height="270"></div>

Потребители пропускают отсутствующие записи, не ждут и не повторяют удалённый 2.

Сохранённая ссылка «ord_8w2k по номеру 2» всегда указывает либо на тот же заказ, либо ни на что, но не на другой.

## Ручное и автоматическое удаление {#manual-removal-versus-automatic}

Здесь действия намеренно выполняет человек. Автоматические механизмы:

- [Настройка потока](/learn/jetstream/shaping-the-stream) — MaxAge, MaxBytes, MaxMsgs, Discard.
- [TTL сообщений](/learn/jetstream/message-ttl) — индивидуальный срок.

Delete и purge — разовые операции; ограничения и TTL — постоянная политика.

## Типичные ошибки {#pitfalls}

Ошибки ручных действий:

**Purge очищает, rm уничтожает.** Первая оставляет готовый поток, вторая удаляет конфигурацию и всех потребителей. Проверяйте вопрос подтверждения.

**Удаление не перенумеровывает.** Не предполагайте непрерывные `1..N`, не вычисляйте следующий как `count + 1` и не приравнивайте количество к максимальному номеру. Номер — стабильный адрес с возможным отсутствием данных.

**Очистку нельзя отменить.** Для важных данных включите DenyPurge и сохраняйте [зеркало](/learn/jetstream/mirrors-and-sources). DenyPurge необратим: отключение отвергается, для очистки потребуется пересоздание. Проверяйте на временном потоке, не ORDERS.

```bash
# Guard a stream so purge requests are refused
nats stream add GUARDED --subjects "guarded.>" --defaults
nats stream edit GUARDED --deny-purge

# A purge now fails instead of silently emptying the stream
nats stream purge GUARDED
```

## Что уже готово {#where-you-are}

Вы умеете удалять через `nats stream rmm` и `nats stream purge` с `--subject`, `--seq`, `--keep`. Номера растут, пробелы не заполняются.

После полной очистки заново [опубликуйте заказы](/learn/jetstream/publishing) для следующей страницы. Они получат новые большие номера вместо 1, 2, 3. Конфигурация и потребители прежние.

## Что дальше {#whats-next}

Содержимым одного сервера вы управляете. Теперь рассмотрим потерю самого сервера.

## См. также {#see-also}

- [Очистка потока](/reference/jetstream/api/stream/purge) — filter, seq, keep.
- [Удаление сообщения](/reference/jetstream/api/stream/msg-delete) — no_erase.
- [Настройка потока](/learn/jetstream/shaping-the-stream) — автоматические пределы.
