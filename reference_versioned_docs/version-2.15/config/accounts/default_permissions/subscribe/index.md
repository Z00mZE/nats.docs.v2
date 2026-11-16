# subscribe {#subscribe}

<Aliases aliases="sub" />
<Reloadable state="reloadable" note="Folded into each user's permissions while the config is parsed, so it only affects users with no explicit `permissions`; from there it follows the users path and is re-applied to live client connections. Not re-applied to existing leafnode connections." />
Один субъект, список субъектов или объект с разрешёнными и запрещёнными субъектами для подписки. Разрешение на субъект может содержать второе необязательное значение — имя группы очереди.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` |  | - |
| `[ string ]` |  | - |
| `object` | Объект с набором явно задаваемых свойств. | - |
## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`allow`](./allow.md) | Список субъектов, разрешённых клиенту. | `string` | - | Да\* |
| [`deny`](./deny.md) | Список субъектов, запрещённых клиенту. | `string` | - | Да\* |

\* Ограничения перезагрузки описаны на странице параметра.
## Examples {#examples}

### Разрешить подписку на `foo` {#allow-subscribe-on-foo}
```
foo
```
### Разрешить подписку на `foo` в группе по шаблону `*.dev` {#allow-subscribe-on-foo-in-group-matching-dev}
```
foo *.dev
```
### Разрешить подписку на `foo.>` и `bar` в группе `v1` {#allow-subscribe-on-foo-and-bar-in-group-v1}
```
[foo.>, "bar v1"]
```
### Разрешить подписку на `foo.*`, кроме `foo.bar` {#allow-subscribe-to-foo-except-foobar}
```
{
  allow: "foo.*"
  deny: "foo.bar"
}
```

