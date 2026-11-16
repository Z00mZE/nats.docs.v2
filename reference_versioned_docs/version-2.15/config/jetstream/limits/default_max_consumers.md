# default_max_consumers {#default_max_consumers}

<Since version="2.15" />
<Reloadable state="reloadable" note="Read live at the moment a consumer is created, so the new value applies to the next consumer created on any stream, including a stream that already exists. It does not remove consumers that already exceed it." />
Максимальное число потребителей по умолчанию для потока, не задающего собственный `max_consumers`, если у его аккаунта тоже нет лимита потребителей. Значение `-1` отключает этот предел и разрешает неограниченное число потребителей, как в версиях до 2.15.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `integer` | - | - |
