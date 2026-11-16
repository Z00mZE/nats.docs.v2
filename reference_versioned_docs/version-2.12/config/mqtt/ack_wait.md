# ack_wait {#ack_wait}

<Aliases aliases="ackwait" />
<Reloadable state="reloadable" note="The reload handler only logs; the value takes effect because the options are swapped. Existing subscriptions keep the old value." />
Время, по истечении которого отправленное клиенту сообщение QoS 1 доставляется повторно как `DUPLICATE`, если сервер не получил пакет `PUBACK` с исходным идентификатором пакета. Сервер использует значение по умолчанию (30 секунд).

Изменения этого параметра применяются только к новым подпискам MQTT.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `duration` | Длительность в виде строки с единицами измерения, например 100ms, 10s, 5m или 2h. | - |
