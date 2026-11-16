# max_payload {#max_payload}

<Aliases aliases="max_pay" />
<Reloadable state="reloadable" note="Re-applied to already-connected clients. The per-client value is reset to unlimited first, so raising the limit works as well as lowering it; the effective value is min(account limit, server max_payload)." />
Максимальный допустимый размер полезной нагрузки сообщений.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `integer` | - | - |
