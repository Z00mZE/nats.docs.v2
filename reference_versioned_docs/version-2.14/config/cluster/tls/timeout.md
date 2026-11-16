# timeout {#timeout}

<Reloadable state="reloadable" note="Read at handshake time, so it applies to every route connection established after the reload. Contrast with gateway.tls.timeout, which hard-fails the reload." />
Тайм-аут рукопожатия TLS.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `duration` | Длительность в виде строки с единицами измерения, например 100ms, 10s, 5m или 2h. | - |
