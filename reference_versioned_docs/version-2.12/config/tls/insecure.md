# insecure {#insecure}

<Reloadable state="reloadable" note="Reloads, but has no effect in this block: it secures inbound client connections, and `insecure` only governs certificate verification on outbound ones." />
Пропустить проверку сертификата. Применяется только к исходящим соединениям, НЕ к входящим клиентским. **Не рекомендуется.**


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
