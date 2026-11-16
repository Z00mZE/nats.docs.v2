# allow_responses {#allow_responses}

<Reloadable state="reloadable" note="Folded into each user's permissions at parse time (only users with no explicit `permissions`). Re-applied live, but setPermissions resets the client's reply-tracking map on EVERY reload, so a service still owing a response for a request received before the reload loses permission to publish it." />

## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
| `object` | Объект с набором явно задаваемых свойств. | - |
## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`max`](./max.md) | Максимальное число сообщений ответа, которое можно опубликовать. | `integer` | - | Да\* |
| [`expires`](./expires.md) | Срок действия разрешения. Можно указать, например, 1s, 1m, 1h (секунда, минута, час). По умолчанию срок не ограничен. | `duration` | - | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
