# token {#token}

<Reloadable state="reloadable" note="Mapped to Options.Authorization; authorizationOption embeds authOption so the reload re-checks every live connection against the new token and disconnects the ones holding the old one." />
Задаёт глобальный токен для аутентификации клиентов на сервере (не используется одновременно с `user` и `password`).


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
