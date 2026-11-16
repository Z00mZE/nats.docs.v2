# users {#users}

<Aliases aliases="auth_users" />
<Reloadable state="not-reloadable" note="diffOptions has no case for the AuthCallout field, so any change to this block - including adding or removing it - hits the default branch and aborts the entire reload with &quot;config reload not supported for AuthCallout&quot;. Every other change in the same config file is discarded with it." />
Имена или открытые NKey пользователей заданного аккаунта, используемых самим сервисом аутентификации и потому обходящих auth callout.


## Типы {#types}

| Тип | Описание | Варианты |
| :--- | :---------- | :------ |
| `[ string ]` | - | - |
