# allow_delete {#allow_delete}

<Reloadable state="reloadable" note="Handled only as part of the whole `resolver` block; replacement resolver is never Start()ed." />
Если true, разрешает удаление JWT. В режиме `full` файл JWT переименовывается с добавлением суффикса `.delete`, если не включён `hard_delete`.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
