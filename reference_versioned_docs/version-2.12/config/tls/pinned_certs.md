# pinned_certs {#pinned_certs}

<Reloadable state="reloadable" note="Reload also disconnects already-connected clients whose certificate is no longer pinned." />
Список отпечатков открытых ключей: SHA256 от представления DER в шестнадцатеричной кодировке. При наличии списка отпечаток предъявленного во время TLS-рукопожатия сертификата должен входить в него, иначе соединение закрывается.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
