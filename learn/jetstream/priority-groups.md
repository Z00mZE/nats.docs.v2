---
id: priority-groups
title: "Группы приоритетов"
sidebar_position: 11
description: "Выбор клиента pull-потребителя и момента выдачи сообщений"
---

# Группы приоритетов {#priority-groups}

[Пул](/learn/jetstream/worker-pool) делил работу по запросам обработчиков shipping.

Иногда нужен один активный клиент до отказа или удалённый резерв, включаемый при отставании ближних. Равномерное разделение этого не обеспечивает.

**Группы приоритетов** задают такое поведение pull-потребителя. Они описаны в [ADR-42](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-42.md). Рассмотрим все три политики.

## Устройство группы {#what-a-priority-group-is}

Это имя группы на потребителе и политика выдачи для неё.

При создании задаются:

- **`PriorityGroups`** — список имён. Сейчас используется только первое, хотя несколько принимаются.
- **`PriorityPolicy`** — `overflow`, `pinned_client` или `prioritized`.

Overflow и pinned_client требуют ack, поэтому примеры задают `--ack explicit`: сервер учитывает ожидающие и неподтверждённые сообщения либо активность запросов клиента. Prioritized только сортирует запросы и не требует ack.

Каждый pull должен указать совпадающую группу, иначе `Bad Request - Priority Group missing`.

Итак, имя и политика задаются потребителю, запрос присоединяется по имени. Далее — три варианта.

## Политика overflow {#the-overflow-policy}

Ближний `us-east` дешёв, удалённый `us-west` медленнее и дороже. Резерв должен работать лишь при отставании основного.

При **overflow** ближние запрашивают без порога, дальние — с `min_pending`. Сервер обслуживает их только при достаточном числе ожидающих; ниже порога запрос не получает ничего.

<div class="nats-flow" data-scenario="priorityOverflowAnimated" data-width="640" data-height="340"></div>

Создайте потребителя ORDERS из файла:

```bash
nats consumer add ORDERS dispatch --config overflow-consumer.json
```

`overflow-consumer.json` задаёт политику и одну группу:

```json
{
  "durable_name": "dispatch",
  "ack_policy": "explicit",
  "priority_policy": "overflow",
  "priority_groups": ["regions"]
}
```

Сокращённая форма `nats consumer add ORDERS dispatch --overflow-groups
regions --ack explicit --pull` до natscli v0.4.x включает политику без группы и вызывает `10159`. До исправления используйте `--config`. Флаги остальных политик ниже работают обычно.

Проверьте:

```bash
nats consumer info ORDERS dispatch
```

В конфигурации два поля:

```
Configuration:

              Pull Mode: true
             Ack Policy: Explicit
        Priority Policy: Overflow
        Priority Groups: regions
```

Порог задаётся запросу, не потребителю. `min_pending` считает ожидающие сообщения, `min_ack_pending` — неподтверждённые. Для выдачи достаточно достижения любого.

У `nats consumer next` этих флагов нет; запрос через библиотеку:

<div class="nats-example" data-type="learn-jetstream-priority-groups-overflowPull" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Ближний обработчик разбирает очередь, дальний включается после порога и снова простаивает, когда основной догоняет.

## Политика pinned_client {#the-pinned_client-policy}

**Pinned_client** держит одного активного клиента и резерв вместо распределения под нагрузкой.

Это нужно конвейеру со строгим порядком: два запущены ради отказоустойчивости, но работать должен один.

Сервер **закрепляет** один ожидающий запрос. Остальные ждут; если закреплённый перестал запрашивать дольше тайм-аута, выбирается резервный.

<div class="nats-flow" data-scenario="priorityPinnedAnimated" data-width="640" data-height="360"></div>

Создайте:

```bash
nats consumer add ORDERS sequencer --pinned-groups ordered --pinned-ttl 90s --ack explicit --pull --defaults
```

`--pinned-groups ordered` задаёт политику и имя, `--pinned-ttl 90s` — допустимый перерыв между запросами.

Тайм-аут закрепления должен с запасом превышать `expires`, получение пакета и обработку. Стандарт — две минуты; `expires` меньше минуты оставляет время циклу.

Клиент получает и удерживает закрепление так:

<div class="nats-example" data-type="learn-jetstream-priority-groups-pinnedClient" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Первое сообщение содержит `Nats-Pin-Id`. Клиент возвращает его в следующих запросах; сервер обслуживает совпадающий ID, удерживая остальных.

После истечения срока новый клиент получает закрепление. Старый ID вызывает `423`: очистите его и запросите без него, возвращаясь в резерв. Протокол и уведомления — в [API потребителей](/reference/jetstream/api/consumer/info).

Администратор может принудительно снять закрепление через `nats consumer unpin`:

```bash
nats consumer unpin ORDERS sequencer ordered -f
```

Команда принимает поток, потребителя и группу; `-f` пропускает подтверждение. Выводит снятого клиента:

```
Unpinned client <client-id> from Priority Group ORDERS > sequencer > ordered
```

Без изменений посмотрите `State` команды `nats consumer info ORDERS sequencer`:

```
State:

          Priority Groups: ordered: pinned <client-id> at 2026-06-02 12:14:22
```

Без активного — `No client`. Все закреплённые потребители находятся через `nats consumer find ORDERS --pinned`.

:::note Поддержка клиентов различается
Сохранение `Nats-Pin-Id`, его возврат и обработка `423` реализованы в Go, Java, JavaScript/TypeScript и .NET. Rust и Python позволяют задать конфигурацию, но ещё не выполняют клиентский цикл закрепления. Проверьте документацию своей библиотеки.
:::

## Политика prioritized {#the-prioritized-policy}

Иногда резерв должен включаться сразу при отсутствии запросов основного, без ожидания накопленного порога.

Например, `us-east` имеет приоритет при свободных ресурсах, затем `us-west`, затем `eu-west`.

**Prioritized** обслуживает `priority` от `0` до `9`, сначала меньшие числа, внутри одного — по кругу. `us-east` с 0 получает при наличии запроса, затем `us-west` с 1, затем `eu-west` с 2.

<div class="nats-flow" data-scenario="priorityPrioritizedAnimated" data-width="640" data-height="360"></div>

Создайте:

```bash
nats consumer add ORDERS dispatch --prioritized-groups regions --pull --defaults
```

`--prioritized-groups regions` задаёт политику и группу. Индивидуальные счётчики не нужны, поэтому явные ack не обязательны.

Имя `dispatch` намеренно повторяет overflow: выберите один вариант региональной диспетчеризации. Политику можно сменить живому потребителю полным `--config`, отдельного флага у `nats consumer edit` нет.

Приоритет — поле запроса; CLI next его не задаёт, поэтому используйте библиотеку:

<div class="nats-example" data-type="learn-jetstream-priority-groups-prioritizedPull" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Overflow избегает частых переключений ценой ожидания порога. Prioritized переключает немедленно, но работа может чаще переходить между регионами.

Все поля, `423`, `PriorityGroupState` и уведомления описаны в [API потребителей](/reference/jetstream/api/consumer/info) и [ADR-42](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-42.md).

## Типичные ошибки {#pitfalls}

Несколько деталей легко упустить.

**Одна группа на потребителя.** Флаги принимают список, но сервер использует только первое имя. Поддержка нескольких планируется. Пока разделяйте регионы или уровни отдельными потребителями со своими группами.

<div class="nats-example" data-type="learn-jetstream-priority-groups-oneGroup" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

**Закрепление не гарантирует исключительное владение.** Сервер может переключить клиента, пока старый ещё выполняет работу. Устаревший ID даст `423`; очистите его и вернитесь в резерв. От дублей защищают явный ack и идемпотентные действия, а не одно закрепление.

**Молчащий клиент удерживает закрепление до срока.** Пока он занят медленной работой, остальные ждут `--pinned-ttl`. Держите `expires` существенно ниже него для своевременного продления. Обслуживание запросов узлами — в [Кластеризации](/learn/clustering).

## Что уже готово {#where-you-are}

Одна группа плюс политика: overflow включает резерв при нагрузке, pinned_client даёт активного и резервного, prioritized немедленно обслуживает меньший номер приоритета.

## Что дальше {#whats-next}

Далее остановим выдачу потребителю на заданное время с сохранением позиции.

## См. также {#see-also}

- [API потребителей](/reference/jetstream/api/consumer/info) — поля, состояние, `423`, уведомления.
- [ADR-42](https://github.com/nats-io/nats-architecture-and-design/blob/main/adr/ADR-42.md) — проектирование.
- [Пул обработчиков](/learn/jetstream/worker-pool) — обычное равномерное разделение.
