# username {#username}

<Aliases aliases="user" />
<Reloadable state="reloadable" note="usernameOption embeds authOption, so the reload re-authenticates every live connection against the new simple-auth username; clients still presenting the old one are disconnected." />
Задаёт глобальное имя пользователя для аутентификации клиентов на сервере (требует `password`, не используется одновременно с `token`).


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
