# password {#password}

<Aliases aliases="pass" />
<Reloadable state="reloadable" note="passwordOption embeds authOption, so the reload re-authenticates every live connection against the new simple-auth password; clients still presenting the old one are disconnected." />
Задаёт глобальный пароль для аутентификации клиентов на сервере (требует `user`, не используется одновременно с `token`).


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
