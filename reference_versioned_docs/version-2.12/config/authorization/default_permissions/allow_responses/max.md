# max {#max}

<Reloadable state="reloadable" note="Folded into each user's permissions at parse time (only users with no explicit `permissions`). Re-applied live, but setPermissions resets the client's reply-tracking map on EVERY reload, so a service still owing a response for a request received before the reload loses permission to publish it." />
Максимальное число сообщений ответа, которое можно опубликовать.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `integer` | - | - |
