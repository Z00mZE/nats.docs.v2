# account {#account}

<Aliases aliases="acc" />
<Reloadable state="not-reloadable" note="diffOptions has no case for the AuthCallout field, so any change to this block - including adding or removing it - hits the default branch and aborts the entire reload with &quot;config reload not supported for AuthCallout&quot;. Every other change in the same config file is discarded with it." />
Имя или открытый NKey аккаунта пользователей, от имени которых сервис авторизации подключается к серверу.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `string` | - | - |
