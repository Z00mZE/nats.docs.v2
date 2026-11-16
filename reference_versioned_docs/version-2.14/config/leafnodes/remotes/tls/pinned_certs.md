# pinned_certs {#pinned_certs}

<Reloadable state="noop" note="Silently ignored for leafnode remotes entirely, not just across reload." />
Список отпечатков открытых ключей: SHA256 от представления DER в шестнадцатеричной кодировке. При наличии списка отпечаток предъявленного во время TLS-рукопожатия сертификата должен входить в него, иначе соединение закрывается.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
