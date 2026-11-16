# expires {#expires}

<Reloadable state="reloadable" note="Folded into each user's permissions at parse time (only users with no explicit `permissions`). Re-applied live, but setPermissions resets the client's reply-tracking map on EVERY reload, so a service still owing a response for a request received before the reload loses permission to publish it." />
Срок действия разрешения. Можно указать, например, 1s, 1m, 1h (секунда, минута, час). По умолчанию срок не ограничен.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `duration` | Длительность в виде строки с единицами измерения, например 100ms, 10s, 5m или 2h. | - |
