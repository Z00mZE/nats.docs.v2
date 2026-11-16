# server_tags {#server_tags}

<Reloadable state="reloadable" note="The reload handler only logs; the new tags reach `/varz` and the next statsz update because the options are swapped." />
Один или несколько тегов сервера. Сейчас используются для размещения потоков и потребителей JetStream.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` |  | - |
| `[ string ]` |  | - |
## Examples {#examples}

```
cloud:aws
```
```
[region:us-west, az:1b]
```

