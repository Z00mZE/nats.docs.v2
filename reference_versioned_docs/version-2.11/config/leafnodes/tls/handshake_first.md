# handshake_first {#handshake_first}

<Aliases aliases="first, immediate" />
<Reloadable state="reloadable" note="Accept side only; applies to newly accepted connections." />
Заставляет соединение листового узла выполнять рукопожатие TLS до отправки удалённой стороной сообщения протокола `INFO`.

Параметр должен быть включён и на удалённом сервере, принимающем соединения листовых узлов, и на самом листовом узле.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
