# proxy {#proxy}

<Since version="2.12" />
<Reloadable state="not-reloadable" />
Подключаться к удалённому узлу через HTTP-прокси.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`url`](./url.md) | URL прокси, например `http://proxy.example.com:3128`. | `string` | - | Нет |
| [`username`](./username.md) | Имя пользователя для аутентификации на прокси. | `string` | - | Нет |
| [`password`](./password.md) | Пароль для аутентификации на прокси. | `string` | - | Нет |
| [`timeout`](./timeout.md) | Время ожидания создания туннеля прокси-сервером. | `duration` | - | Нет |
