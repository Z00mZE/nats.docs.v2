# insecure {#insecure}

<Reloadable state="reloadable" note="Meaningless for the inbound MQTT listener; reloads without error but changes nothing observable." />
Пропустить проверку сертификата. Применяется только к исходящим соединениям, НЕ к входящим клиентским. **Не рекомендуется.**


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
