# routes {#routes}

<Reloadable state="reloadable" note="Routes are diffed on reload: added ones are solicited and removed ones torn down. The cluster listener is not restarted." />
Список URL серверов для объединения в кластер. Маршруты к самому себе игнорируются. Если требуется аутентификация по токену или имени пользователя и паролю, укажите их в URL.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `[ string ]` | - | - |
## Examples {#examples}

### Простые URL маршрутов {#simple-route-urls}
```
routes: [
  nats-route://localhost:6222,
  nats-route://localhost:6223,
  nats-route://localhost:6224,
]

```

