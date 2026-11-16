# proxy_required {#proxy_required}

<Since version="2.12" />
<Reloadable state="reloadable" note="Read when a leaf node authenticates, so the new value applies to connections made after the reload. Existing connections keep the setting they connected under." />
Отклонять соединения листовых узлов этого пользователя без заголовка протокола PROXY. Параметр `proxy_required` во внешнем блоке `authorization` распространяет требование на всех пользователей независимо от их собственных настроек.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `boolean` | - | `true`, `false` |
