# no_auth_user {#no_auth_user}

<Reloadable state="reloadable" note="Removing `no_auth_user` reloads, provided no user in the new configuration still has that username. Setting or changing it fails the reload." />
Имя пользователя, чьи разрешения наследуют неаутентифицированные клиенты. Пользователь должен быть определён в блоке `authorization` или `accounts`.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
