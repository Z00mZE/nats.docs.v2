# connect_retries {#connect_retries}

<Reloadable state="reloadable" note="Applies to route connection attempts started after the reload; an in-progress retry loop keeps the old value." />
Число неудачных попыток подключения, после которого сервер прекращает подключаться к *обнаруженному* маршруту. По умолчанию 0: повторных попыток нет. Если параметр включён, попытки выполняются раз в секунду. К явно заданным маршрутам это не относится.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `integer` | - | - |
