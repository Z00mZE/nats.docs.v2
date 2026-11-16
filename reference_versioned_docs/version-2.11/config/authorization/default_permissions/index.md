# default_permissions {#default_permissions}

<Reloadable state="reloadable" note="Folded into each user's permissions while the config is parsed, so it only affects users with no explicit `permissions`; from there it follows the users path and is re-applied to live client connections. Not re-applied to existing leafnode connections." />
Разрешения по умолчанию для пользователей, если для них явно не заданы разрешения.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`publish`](./publish/index.md) | Один субъект, список субъектов или объект с разрешёнными и запрещёнными субъектами для публикации. Один субъект или список задаёт *разрешение* и неявно запрещает публикацию во все остальные субъекты. | `(multiple)` | - | Да\* |
| [`subscribe`](./subscribe/index.md) | Один субъект, список субъектов или объект с разрешёнными и запрещёнными субъектами для подписки. Разрешение на субъект может содержать второе необязательное значение — имя группы очереди. | `(multiple)` | - | Да\* |
| [`allow_responses`](./allow_responses/index.md) |  | `(multiple)` | - | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
