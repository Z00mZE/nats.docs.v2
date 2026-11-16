# mappings {#mappings}

<Aliases aliases="maps" />
<Reloadable state="reloadable" note="Replaced wholesale on the live account; adding, changing and removing mappings all take effect for existing connections. For the global account, leafnode subject-interest maps are fixed up in the same reload." />

## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
| `object` | Объект с набором явно задаваемых свойств. | - |
## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`destination`](./destination.md) | Назначение отображения для исходного субъекта. | `string` | - | Да |
| [`weight`](./weight.md) | Число от 0 до 100 включительно. В строковой форме допускается завершающий знак `%`. Если используется поле `cluster`, сумма весов назначений для каждого кластера должна составлять 100%, кроме случаев намеренной потери сообщений при тестировании. | `(multiple)` | - | Да |
| [`cluster`](./cluster.md) | Если задано, назначение ограничивается кластером. Серверы указанного кластера учитывают для полученных сообщений только отображения с таким же именем кластера. В противном случае используются отображения без привязки к кластеру. | `string` | - | Да |
