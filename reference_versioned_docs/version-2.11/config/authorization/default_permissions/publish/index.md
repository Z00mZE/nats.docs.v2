# publish {#publish}

<Aliases aliases="pub" />
<Reloadable state="reloadable" note="Folded into each user's permissions while the config is parsed, so it only affects users with no explicit `permissions`; from there it follows the users path and is re-applied to live client connections. Not re-applied to existing leafnode connections." />
Один субъект, список субъектов или объект с разрешёнными и запрещёнными субъектами для публикации. Один субъект или список задаёт *разрешение* и неявно запрещает публикацию во все остальные субъекты.


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

### Разрешить публикацию в `foo` {#allow-publish-to-foo}
```
foo
```
### Разрешить публикацию в `foo` и `bar.*` {#allow-publish-on-foo-and-bar}
```
[foo, bar.*]
```
### Разрешить публикацию в `foo.*`, кроме `foo.bar` {#allow-publish-to-foo-except-foobar}
```
{
  allow: "foo.*"
  deny: "foo.bar"
}
```

