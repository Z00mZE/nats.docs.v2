# max_subscriptions {#max_subscriptions}

<Aliases aliases="max_subs" />
<Reloadable state="reloadable" note="Re-applied to already-connected clients, and a client already holding more subscriptions than the new limit is disconnected with MaxSubscriptionsExceeded. Effective value is min(account limit, server max_subscriptions)." />
Максимальное число одновременных подписок этого аккаунта.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `integer` | - | - |
