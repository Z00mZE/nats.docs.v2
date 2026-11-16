---
id: authentication-basics
title: "Основы аутентификации"
sidebar_position: 2
description: "Централизованная аутентификация конфигурацией и три вида учётных данных"
---

# Основы аутентификации {#authentication-basics}

Сервер без защиты допускает всех, кто достигает порта. Добавим первый список пользователей.

**Аутентификация** связывает соединение с пользователем. Простейший способ — список в конфигурации сервера.

## Централизованная аутентификация {#centralized-authentication}

Полный список хранится в nats.conf.

Сервер сравнивает предъявленные данные со списком и не обращается к внешнему сервису.

<div class="nats-flow" data-scenario="centralizedAuthAnimated" data-width="600" data-height="380"></div>

Это удобно небольшой редко меняющейся группе пользователей, когда конфигурацией владеет одна команда.

Include может временно облегчить рост, разнеся данные по файлам. Считайте это отсрочкой перехода от централизованной модели.

## Данные входа order-svc {#giving-order-svc-a-credential}

Платформе нужны order-svc и analytics-reader.

Они задаются в users блока authorization, имя — user, далее данные входа:

```conf
authorization {
  users: [
    { user: order-svc, password: s3cr3t }
    { user: analytics-reader, password: an4lytics }
  ]
}
```

Пара user/password order-svc / s3cr3t определяет пользователя. Оба пока в `$G`; [учётные записи](/learn/security/accounts-and-multitenancy) разделят их позже.

Для одного пользователя можно задать user/password прямо в authorization без массива.

[`timeout`](/reference/config/authorization/timeout) ограничивает аутентификацию, стандарт — две секунды. Числа означают секунды, длительности требуют кавычек (`timeout: "500ms"`; голое 1m разбирается числом). Поля — в [справочнике](/reference/config/authorization).

Запустите:

```bash
nats-server -c nats.conf
```

`-c` задаёт файл. Теперь order-svc может войти.

## Подключение order-svc {#connecting-as-order-svc}

CLI передаёт два флага, библиотека — поля вызова connect. Опубликуем прежний заказ в orders.created:

<div class="nats-example" data-type="learn-security-authentication-basics-connect" data-languages="cli"></div>

```
14:18:38 Published 91 bytes to "orders.created"
```

Данные совпали, сервер принял 91 байт. Неверный пароль отклоняется ещё до публикации:

```bash
nats pub orders.created "test" --user order-svc --password wrong
```

```
nats: error: nats: Authorization Violation
```

Без данных возникает та же Authorization Violation, как при неизвестном пользователе. Ответ не раскрывает, какая часть неверна.

Аутентификация выполняется при установлении соединения и определяет его пользователя. Разрешённые действия — отдельная [Авторизация](/learn/security/authorization).

При прозрачном переподключении новый канал проходит проверку снова.

### Другие данные входа {#other-ways-a-user-entry-can-authenticate}

Конфигурация поддерживает user/password, NKey и token; модель та же.

**User/password** сравнивает отправленный пароль с сохранённым.

**NKey** хранит только открытый ключ вместо пары user/password; смешение запрещено. Клиент подписывает одноразовый запрос закрытым seed, не передавая секрет:

```conf
users: [
  { nkey: UAPZQH4MNJCOVEJFERB3NFSIROQ5RE7CGBEPKAZSB6QB7IQHBKXHZPVP }
]
```

Создайте пару, внесите открытый ключ и подключитесь с seed:

<div class="nats-example" data-type="learn-security-authentication-basics-nkey-user" data-languages="cli"></div>

```
UAPZQH4MNJCOVEJFERB3NFSIROQ5RE7CGBEPKAZSB6QB7IQHBKXHZPVP
18:02:29 Published 91 bytes to "orders.created"
```

`nats auth nkey gen` пишет seed в user.nk без вывода, show печатает открытый ключ, pub использует seed. Неизвестный ключ даёт Authorization Violation. Подробнее — в [Децентрализованной аутентификации](/learn/security/decentralized-auth).

**Token** — общий секрет без имени, задаваемый верхним `authorization { token: "shared-secret-rotate-me" }`. Не бывает отдельным для пользователя, действует на сервер и подходит простым внутренним схемам. В главе token означает это, не JWT.

CLI `--user` означает также токен: без password отправляется как token и может скрыть неверную настройку.

## Хранение паролей {#storing-passwords}

Открытый пароль допустим учебному ноутбуку, но не доступной другим конфигурации.

При запуске сервер сам предупреждает:

```
[WRN] Plaintext passwords detected, use nkeys or bcrypt
```

Храните **bcrypt** вместо пароля: клиент всё ещё отправляет исходное значение, сервер сравнивает с односторонним хешем. Утечка файла не раскрывает готовый пароль.

Создайте хеш. Начальный пробел может исключить строку из истории некоторых оболочек; вообще будьте осторожны с секретами во флагах:

```sh
 nats server passwd --pass "s3cr3t-rotate-me-later"
```

```
$2a$11$4I9tIK1JVbttZYtn.F.Jse5iY5ves4EtYWIpjlwyvgVYHJc8yTvk.
```

Без pass ввод интерактивен; generate создаёт сильную фразу, cost увеличивает стандартную стоимость 11. Меньше десяти символов отклоняется с `password should be at least 10 characters
long`, поэтому пример использует s3cr3t-rotate-me-later.

Префикс `$2a$11$` означает bcrypt Go со стоимостью 11. Другие варианты распознаются ради совместимости, но не полагайтесь на них. Остальное сравнивается открыто; строки с `$` зарезервированы под хеши, не начинайте ими обычный пароль.

Вставьте хеш вместо пароля; кавычки необязательны. Конечная точка, если есть, входит в значение:

```conf
authorization {
  users: [
    { user: order-svc, password: "$2a$11$4I9tIK1JVbttZYtn.F.Jse5iY5ves4EtYWIpjlwyvgVYHJc8yTvk." }
    { user: analytics-reader, password: an4lytics }
  ]
}
```

Клиент использует s3cr3t-rotate-me-later, из которого получен хеш. После хеширования всех записей предупреждение исчезает. Далее для читаемости снова короткий s3cr3t.

Token тоже может содержать bcrypt-хеш, при этом клиент отправляет исходный токен.

Bcrypt защищает файл, не передачу открытого секрета. Нужен [TLS](/learn/security/encryption).

## За рамками {#what-this-page-does-not-cover}

mTLS может отображать сертификат прямо в пользователя; это часть [Шифрования и TLS](/learn/security/encryption).

При динамических пользователях и множестве арендаторов централизованный файл неудобен. [Режим оператора](/learn/security/operator-mode) решает масштабирование.

## Типичные ошибки {#pitfalls}

При конфигурационных данных входа:

**Отсутствие аутентификации.** Без authorization порт открыт всем. Добавьте пользователей и проверяйте отказ `nats: error: nats: Authorization Violation`. [`no_auth_user`](/reference/config/no_auth_user) может допустить анонимных как именованного пользователя даже со списком: включайте осознанно, см. [Учётные записи](/learn/security/accounts-and-multitenancy).

**Открытые пароли.** Не игнорируйте `Plaintext passwords detected, use nkeys or bcrypt`. Используйте хеш nats server passwd.

**Секреты в git.** Пароль и даже хеш в конфигурации — секрет. После попадания в историю нужна ротация. Используйте окружение или хранилище секретов, реальный файл исключите через .gitignore.

**Пароль в URL.** `nats://order-svc:s3cr3t@localhost:4222` попадает в историю, список процессов и журналы. Сохраните именованный контекст, передавая `"$NATS_PASSWORD"`, затем используйте имя:

<div class="nats-example" data-type="learn-security-authentication-basics-context-creds" data-languages="cli"></div>

```
14:19:37 Published 91 bytes to "orders.created"
```

Контекст хранит пароль. Экспортированный NATS_PASSWORD вызывает `WARNING: Shell environment overrides in place using NATS_PASSWORD`; не экспортируйте или удалите после сохранения.

Оболочка Unix подставляет реальный пароль до запуска команды, поэтому другие пользователи всё ещё могут увидеть аргумент процесса. Окружение современных Unix обычно другим не раскрывается.

## Что уже готово {#where-you-are}

Есть:

- Сервер с nats-server -c nats.conf.
- Два пользователя authorization в $G и знание bcrypt.
- Проверка успешного заказа и отказа неверному паролю.

## Что дальше {#whats-next}

Личность order-svc известна, но действия пока не ограничены. Добавим права.

Перейдите к [Авторизации](/learn/security/authorization).

## См. также {#see-also}

- [authorization](/reference/config/authorization) — поля и timeout.
- [Авторизация](/learn/security/authorization) — действия пользователя.
- [Основные понятия → Безопасность](/concepts/security) — краткий обзор.
