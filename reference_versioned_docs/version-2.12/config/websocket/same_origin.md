# same_origin {#same_origin}

<Reloadable state="not-reloadable" />
Параметр относится к клиентам в веб-браузере, например [nats.js][nats.js].

При значении `true` HTTP-заголовок `Origin` должен соответствовать имени хоста запроса. Подробнее см. документацию о [совместном использовании ресурсов между источниками][cors].

Проверка выполняется только при наличии в запросе заголовка `Origin`, который браузеры отправляют, а небраузерные клиенты обычно нет.

[nats.js]: https://github.com/nats-io/nats.js
[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
