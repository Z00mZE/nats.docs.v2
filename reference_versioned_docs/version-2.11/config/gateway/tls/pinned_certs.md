# pinned_certs {#pinned_certs}

<Reloadable state="not-reloadable" note="Changing the pinned certificates fails the whole reload, so the server has to be restarted. Reloading them is supported from 2.14." />
Список отпечатков открытых ключей: SHA256 от представления DER в шестнадцатеричной кодировке. При наличии списка отпечаток предъявленного во время TLS-рукопожатия сертификата должен входить в него, иначе соединение закрывается.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
