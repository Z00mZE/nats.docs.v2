# subscribe {#subscribe}

<Aliases aliases="sub" />
<Reloadable state="reloadable" />
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
| [`allow`](./allow.md) | Список субъектов, разрешённых клиенту. | `string` | - | Да |
| [`deny`](./deny.md) | Список субъектов, запрещённых клиенту. | `string` | - | Да |
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

