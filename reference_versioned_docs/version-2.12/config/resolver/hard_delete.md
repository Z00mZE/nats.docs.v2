# hard_delete {#hard_delete}

<Reloadable state="reloadable" note="Handled only as part of the whole `resolver` block; replacement resolver is never Start()ed." />
Если true и резолвер работает в режиме `full`, удаляемые JWT аккаунтов удаляются с диска, а не переименовываются с добавлением суффикса `.delete`.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
