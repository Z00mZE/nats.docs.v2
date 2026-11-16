# jwt_cookie {#jwt_cookie}

<Reloadable state="not-reloadable" />
Имя HTTP-cookie, которое при наличии используется как JWT клиента. HTTP-сервер должен устанавливать cookie, как описано [здесь][cookie]. Это полезно при создании клиентских JWT NATS типа `Bearer` в результате аутентификации. После успешной аутентификации HTTP-сервер может выдать JWT пользователя, безопасно сохранив его без доступа посторонних скриптов. Это должны быть [JWT NATS][jwt].

**Примечание:** если клиент передаёт JWT в протоколе `CONNECT`, этот параметр игнорируется.

[cookie]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
[jwt]: https://docs.nats.io/nats-server/configuration/securing_nats/jwt


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
