# write_timeout {#write_timeout}

<Since version="2.12" />
<Reloadable state="not-reloadable" />
Действие сервера при превышении `write_deadline` соединения: `close` закрывает его, `retry` продолжает попытки, `default` использует встроенное поведение.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | `default`, `close`, `retry` |
