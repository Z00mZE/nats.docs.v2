# pinned_certs {#pinned_certs}

<Reloadable state="reloadable" note="One of the few settings in this domain that also acts on EXISTING connections — routes whose cert no longer matches are disconnected." />
Список отпечатков открытых ключей: SHA256 от представления DER в шестнадцатеричной кодировке. При наличии списка отпечаток предъявленного во время TLS-рукопожатия сертификата должен входить в него, иначе соединение закрывается.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
