# handshake_first {#handshake_first}

<Aliases aliases="first, immediate" />
<Reloadable state="reloadable" note="On 2.11/2.12 the server logs that the value was reloaded while continuing to use the old one." />
Заставляет соединение листового узла выполнять рукопожатие TLS до отправки удалённой стороной сообщения протокола `INFO`.

Параметр должен быть включён и на удалённом сервере, принимающем соединения листовых узлов, и на самом листовом узле.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
