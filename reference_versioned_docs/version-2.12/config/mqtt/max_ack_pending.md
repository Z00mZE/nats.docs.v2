# max_ack_pending {#max_ack_pending}

<Aliases aliases="max_pending, max_inflight" />
<Reloadable state="reloadable" note="Existing sessions pick up the new value, but each subscription captures its own limit when it is created, so only subscriptions made after the reload are governed by it." />
Число сообщений QoS 1, которое сервер может отправить подписке, не получив для них ни одного `PUBACK`. Допустимый диапазон: [0..65535].

Сумма max_ack_pending подписок одного сеанса не может превышать 65535. При попытке создать подписку, превышающую общий лимит, сервер возвращает для неё `0x80` в `SUBACK`.

Из-за особенностей обработки подстановки MQTT `#` сервером NATS каждая подписка, оканчивающаяся на `#`, использует удвоенное значение `max_ack_pending`. Изменения этого параметра применяются только к новым подпискам.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `integer` | - | - |
