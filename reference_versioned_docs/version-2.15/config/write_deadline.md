# write_deadline {#write_deadline}

<Reloadable state="reloadable" note="The reload is accepted and logged, but existing connections keep the deadline they were created with. Only connections established after the reload use the new value." />
Максимальное время блокировки сервера при записи в секундах. При превышении соединение закрывается. О способах обработки на стороне клиента см. раздел о медленных потребителях.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `duration` | Длительность в виде строки с единицами измерения, например 100ms, 10s, 5m или 2h. | - |
