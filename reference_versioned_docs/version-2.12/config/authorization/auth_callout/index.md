# auth_callout {#auth_callout}

<Reloadable state="not-reloadable" note="diffOptions has no case for the AuthCallout field, so any change to this block - including adding or removing it - hits the default branch and aborts the entire reload with &quot;config reload not supported for AuthCallout&quot;. Every other change in the same config file is discarded with it." />
Включает auth callout. Учётные данные всех клиентских соединений, требующих аутентификации, передаются выделенному сервису аутентификации.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`issuer`](./issuer.md) | Открытый NKey аккаунта. | `string` | - | Нет\* |
| [`account`](./account.md) | Имя или открытый NKey аккаунта пользователей, от имени которых сервис авторизации подключается к серверу. | `string` | `$G` | Нет\* |
| [`users`](./users.md) | Имена или открытые NKey пользователей заданного аккаунта, используемых самим сервисом аутентификации и потому обходящих auth callout. | `string` | - | Нет\* |
| [`key`](./key.md) | Открытый XKey для шифрования запросов сервера к сервису аутентификации. | `string` | - | Нет\* |

\* Ограничения перезагрузки описаны на странице параметра.
