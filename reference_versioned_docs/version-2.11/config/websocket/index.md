# websocket {#websocket}

<Aliases aliases="ws" />
<Reloadable state="reloadable" note="Only the TLS certificate material reloads, and only for connections accepted afterwards. Every other `websocket` setting fails the reload, including `verify_and_map` and `pinned_certs`." />
Конфигурация включения интерфейса WebSocket.


## Свойства {#properties}

| Имя | Описание | Тип | По умолчанию | Перезагрузка |
| :--- | :---------- | :--- | :------ | :--------- |
| [`host`](./host.md) |  | `string` | `0.0.0.0` | Нет |
| [`port`](./port.md) | Порт приёма клиентских соединений WebSocket. Значения по умолчанию нет: слушатель запускается только после задания порта здесь или через `listen`. TLS обязателен, если `no_tls` не равен `true`. | `integer` | - | Нет |
| [`listen`](./listen.md) |  | `string` | - | Нет |
| [`advertise`](./advertise.md) | Объявляемый клиентский адрес `<host>:<port>`. Полезен для кластеров за NAT. | `string` | - | Нет |
| [`tls`](./tls/index.md) |  | `object` | - | Да\* |
| [`no_tls`](./no_tls.md) |  | `boolean` | - | Нет |
| [`same_origin`](./same_origin.md) | Параметр относится к клиентам в веб-браузере, например [nats.js][nats.js]. При значении `true` HTTP-заголовок `Origin` должен соответствовать имени хоста запроса. Подробнее см. документацию о [совместном использовании ресурсов между источниками][cors]. Проверка выполняется только при наличии заголовка `Origin`, который браузеры отправляют, а небраузерные клиенты обычно нет.  [nats.js]: https://github.com/nats-io/nats.js [cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS | `boolean` | `false` | Нет |
| [`allowed_origins`](./allowed_origins.md) | Список допустимых источников. Если список пуст и `same_origin` равен `false`, разрешены клиенты из любого источника. Список задаёт единственные допустимые значения заголовка `Origin` в запросе клиента. Схема, хост и порт должны совпадать. Если TCP-порт в URL не указан, для схемы "http://" подразумевается порт 80, а для "https://" — 443. | `string` | - | Нет |
| [`handshake_timeout`](./handshake_timeout.md) | Общее время, отведённое серверу на чтение клиентского запроса и отправку ответа клиенту, включая рукопожатие TLS. | `duration` | - | Нет |
| [`compress`](./compress.md) | Включает поддержку сжатых кадров WebSocket на сервере. Для использования сжатия его должны поддерживать и сервер, и клиент. | `boolean` | - | Нет |
| [`authorization`](./authorization/index.md) |  | `object` | - | Нет |
| [`headers`](./headers.md) | Дополнительные HTTP-заголовки в ответе на переход к WebSocket. | `string` | - | Нет |
| [`user_cookie`](./user_cookie.md) | Имя HTTP-cookie с именем пользователя для клиентов, аутентифицирующихся через сеанс браузера. | `string` | - | Нет |
| [`pass_cookie`](./pass_cookie.md) | Имя HTTP-cookie с паролем. | `string` | - | Нет |
| [`token_cookie`](./token_cookie.md) | Имя HTTP-cookie с токеном аутентификации. | `string` | - | Нет |
| [`jwt_cookie`](./jwt_cookie.md) | Имя HTTP-cookie, которое при наличии используется как JWT клиента. HTTP-сервер должен устанавливать cookie, как описано [здесь][cookie]. Это полезно при создании клиентских JWT NATS типа `Bearer` в результате аутентификации. После успешной аутентификации HTTP-сервер может выдать JWT пользователя, безопасно сохранив его без доступа посторонних скриптов. Это должны быть [JWT NATS][jwt]. **Примечание:** если клиент передаёт JWT в протоколе `CONNECT`, этот параметр игнорируется.  [cookie]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies [jwt]: https://docs.nats.io/nats-server/configuration/securing_nats/jwt | `string` | - | Нет |
| [`no_auth_user`](./no_auth_user.md) | Если клиент WebSocket не передаёт имя пользователя при подключении, это имя используется по умолчанию на этапе аутентификации. Для клиентов WebSocket оно переопределяет любое значение `no_auth_user` из основного файла конфигурации. Листовой узел, подключающийся по WebSocket, также использует его вместо параметра `no_auth_user` верхнего уровня. *Примечание: этот вариант несовместим с запуском сервера в режиме оператора.* | `string` | - | Нет |

\* Ограничения перезагрузки описаны на странице параметра.
