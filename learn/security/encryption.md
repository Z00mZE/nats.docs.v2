---
id: encryption
title: "Шифрование и TLS"
sidebar_position: 9
description: "Защита канала TLS и mTLS и шифрование хранилища JetStream на диске"
---

# Шифрование и TLS {#encryption--tls}

Освоены список пользователей, цепочка ACME и auth callout, но все пока передают данные по открытому каналу. Учётные данные и JSON заказов читаемы наблюдателю соединения.

Добавим TLS, сертификат клиента как личность order-svc, TLS до первого байта протокола и шифрование JetStream на диске.

## TLS каждого типа соединения {#tls-is-per-connection-type}

Есть клиентские, кластерные, листовые и шлюзовые соединения.

У каждого своя конфигурация. Верхний tls защищает только клиентов.

Мониторинг, WebSocket, MQTT, leafnodes, cluster и gateway имеют собственные вложенные tls. Клиентский TLS не шифрует маршруты автоматически.

Это позволяет разным моделям угроз иметь отдельные параметры. Здесь защищаем order-svc — сервер.

## Серверный TLS {#server-side-tls}

Нужны **сертификат** cert_file, **закрытый ключ** key_file и **сертификат CA** ca_file, которому доверяются сертификаты участников.

Для обучения создайте временный CA и серверный сертификат openssl:

```bash
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
  -keyout ca-key.pem -out ca.pem -subj "/CN=Acme Test CA" -days 30
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
  -keyout server-key.pem -out server.csr -subj "/CN=nats.acme.internal"
openssl x509 -req -in server.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out server-cert.pem -days 30 \
  -extfile <(printf "subjectAltName=DNS:nats.acme.internal,IP:127.0.0.1")
```

SAN включает DNS и loopback. Скопируйте три PEM в /etc/nats/certs/. Для эксплуатации используйте организационную PKI или публичный CA.

Добавьте tls:

```conf
# nats.conf — client connections now require TLS
listen: "0.0.0.0:4222"

tls {
  cert_file: "/etc/nats/certs/server-cert.pem"
  key_file:  "/etc/nats/certs/server-key.pem"
  ca_file:   "/etc/nats/certs/ca.pem"
  timeout:   2
}
```

Timeout — секунды установления TLS, стандарт 2. Короткий не даст медленным клиентам закончить, длинный удерживает зависшие подключения.

Проверьте `nats-server -t -c nats.conf`, затем запустите:

```sh
nats-server -c nats.conf
```

Журнал: `TLS required for client connections`. Открытый клиент отвергается до аутентификации.

## Доверие CA на клиенте {#the-client-must-trust-the-ca}

До отправки секретов клиент проверяет сервер по доверенному CA своей цепочки сертификатов.

К прежнему [подключению](/learn/security/authentication-basics) добавляется --tlsca; библиотеки принимают тот же PEM.

<div class="nats-example" data-type="learn-security-encryption-connect-tls" data-languages="cli"></div>

```
14:22:18 Published 91 bytes to "orders.shipped"
```

91 байт теперь зашифрован в пути. Сам сервер является конечной точкой TLS и видит открытые данные; дальнейшая пересылка зависит от защиты следующих соединений.

Имя подключения должно совпадать с сертификатом. Только nats.acme.internal не покрывает прямой 127.0.0.1. Но подключение по имени, разрешившемуся в loopback, корректно, если DNS это допускает.

Шифры, кривые и закрепление — в [TLS](/reference/config/tls). Здесь cert_file, key_file, ca_file, timeout.

Сервер объявляет соседей через client_advertise для переподключений. Если объявлен IP, клиент должен трактовать его как обновление адреса DNS и при соединении с новым IP проверять исходное DNS-имя. Это правило именно для IP в обнаруженном списке.

## Взаимный TLS и личность сертификата {#mutual-tls-mapping-the-certificate-to-the-identity}

**MTLS** также доказывает серверу личность клиента его сертификатом.

Сертификат обязан строить цепочку к серверному ca_file; это ещё не определяет пользователя.

[`verify_and_map: true`](/reference/config/tls/verify_and_map) проверяет и отображает: сначала email SAN, затем DNS, URI, затем subject DN RFC 2253. SAN используется при совпадении с пользователем, иначе возможен DN даже при наличии SAN.

Сертификат заменяет пароль и creds. DN сравнивается по правилам имён, а не простыми строками: пробелы и порядок атрибутов не мешают.

В ORDERS пользователь остаётся в своей [учётной записи](/learn/security/accounts-and-multitenancy) и получает прежние [права orders.>](/learn/security/authorization). Имя заменяется на DN. ANALYTICS и остальная конфигурация прежние:

```conf
# nats.conf — the client certificate is the user
listen: "0.0.0.0:4222"

tls {
  cert_file:      "/etc/nats/certs/server-cert.pem"
  key_file:       "/etc/nats/certs/server-key.pem"
  ca_file:        "/etc/nats/certs/ca.pem"
  verify_and_map: true
}

accounts {
  ORDERS {
    jetstream: enabled
    users: [
      {
        user: "CN=order-svc,O=Acme"
        permissions: {
          publish:   { allow: ["orders.>"] }
          subscribe: { allow: ["_INBOX.>"] }
        }
      }
    ]
  }
}
```

Выпустите сертификат тем же CA. Атрибуты openssl дают RFC 2253 `CN=order-svc,O=Acme`, как user:

```bash
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
  -keyout order-svc-key.pem -out order-svc.csr -subj "/O=Acme/CN=order-svc"
openssl x509 -req -in order-svc.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out order-svc-cert.pem -days 30
```

Клиент использует --tlscert и --tlskey вместо пароля:

<div class="nats-example" data-type="learn-security-encryption-connect-mtls" data-languages="cli"></div>

```
14:23:05 Published 91 bytes to "orders.shipped"
```

Сервер связывает CN=order-svc,O=Acme с пользователем ORDERS и применяет права.

Правила DN сложнее равенства строк; сервер понимает в том числе множества атрибутов.

Verify_and_map включает verify, оба не нужны. Обычный verify используйте, если личность сертификата уже отображает внешняя система.

## TLS-first {#tls-first-handshakes}

Обычно первым идёт открытый INFO с версией и URL, затем TLS до секретов.

<div class="nats-flow" data-scenario="tlsFirstHandshakeAnimated" data-width="600" data-height="380"></div>

На верхней дорожке INFO открыт, на нижней первый байт принадлежит TLS.

**Handshake_first** выполняет TLS до протокола, как HTTPS:

```conf
tls {
  cert_file: "/etc/nats/certs/server-cert.pem"
  key_file:  "/etc/nats/certs/server-key.pem"
  ca_file:   "/etc/nats/certs/ca.pem"
  handshake_first: true
}
```

Сервер предупреждает при запуске:

```
[WRN] Clients that are not using "TLS Handshake First" option will fail to connect
```

Ожидающий INFO клиент получит `nats: error: read tcp ...: i/o timeout`. В CLI нужен --tlsfirst, также у context save; библиотеки имеют аналог.

Для перехода auto/auto_fallback ждут TLS 50 мс, затем отправляют INFO. Строка 300ms задаёт другой период.

OpenSSL s_client на обычном NATS-порту получает wrong version number из-за INFO, не поломки TLS. При handshake_first работает как с обычной TLS-точкой.

Для GnuTLS CLI:

```sh
gnutls-cli --starttls --port 4222 server.host.name
```

После INFO нажмите Control-D для начала TLS.

## Шифрование хранения {#encryption-at-rest}

TLS не защищает диск. **Шифрование хранения** — отдельная общесерверная AEAD-защита данных и метаданных JetStream, не по записям. Оно независимо от транспортного TLS.

Шифрование блоков может выполнять контроллер диска без нагрузки CPU сервера. Оцените, требуется ли именно серверное шифрование.

Задайте key в jetstream через переменную окружения, не секретом в файле:

```conf
jetstream {
  store_dir: "/data/jetstream"
  key: $JS_KEY
}
```

```sh
JS_KEY="s3cr3t-master-key" nats-server -c nats.conf
```

Стандарт — ChaCha20-Poly1305, cipher: aes выбирает AES-GCM:

```
[INF]   Encryption:      ChaCha20-Poly1305
```

Для ротации перезапустите с новым key и старым prev_key. Сервер перепакует ключи потоков; затем запускайте только с новым. Prev_key нужен один переходный рестарт. TPM и прочее — в [encryption_key](/reference/config/jetstream/encryption_key).

## Типичные ошибки {#pitfalls}

Ловушки канала и диска:

**TLS без verify не проверяет клиента.** Сервер доказывает себя, но не требует клиентский сертификат. Включите verify или verify_and_map и проверьте вход без сертификата:

<div class="nats-example" data-type="learn-security-encryption-verify-required" data-languages="cli"></div>

```
nats: error: remote error: tls: certificate required
```

Правильный результат — отказ и `[ERR] ... TLS handshake error:
tls: client didn't provide a certificate`. Успех означает отсутствие проверки.

**Verify_and_map требует существующую личность.** CN=order-svc,O=Acme эквивалентен вариантам с пробелами и порядком, но неверное значение даёт `nats: error: nats: Authorization Violation` и authentication error. Читайте DN через openssl x509 -noout -subject, не набирайте вручную.

**Кластеру и шлюзу нужны serverAuth и clientAuth.** Одна сторона и принимает, и подключается; TLS всегда взаимный. Сертификат только serverAuth вызывает на соседе `TLS route handshake error: ... certificate
specifies an incompatible key usage`. Обратное направление иногда сохраняет работающий кластер, поэтому ищите журнал, не только отсутствие маршрута. См. [Кластеризацию](/learn/clustering), [Листы](/learn/topologies/leaf-nodes), [TLS](/reference/config/tls).

**Замена файлов требует reload.** cert_file/key_file/ca_file читаются при запуске или SIGHUP, не при каждой установке связи. Существующие соединения сохраняют сессию, новые используют замену. Следите за сроком и применяйте `nats-server --signal reload=<pid>`; см. [Защиту системы](/learn/deployment/hardening).

**Handshake_first true закрывает старых клиентов.** Сначала используйте 300ms для совместимости, затем true после перехода всех на tlsfirst.

**Неверный дисковый ключ скрывает потоки, не уничтожает.** `Error decrypting our stream metafile: unable to recover keys` исправляется рестартом с верным. После ротации удалите prev_key, не держите старый секрет активным.

## Что уже готово {#where-you-are}

Order-svc использует TLS, при желании до INFO. Verify_and_map связывает сертификат с прежними правами ORDERS без пароля/creds. JetStream шифруется ключом вне конфигурации.

Кластер, листы и шлюзы всё ещё требуют собственных tls; см. [Кластеризацию](/learn/clustering) и [Листы](/learn/topologies/leaf-nodes).

## Что дальше {#whats-next}

Последняя страница собирает модель и контрольный список.

Перейдите к [итогам](/learn/security/where-next).

## См. также {#see-also}

- [TLS](/reference/config/tls) — шифры, кривые, pinning, OCSP.
- [encryption_key](/reference/config/jetstream/encryption_key) — шифрование диска.
- [Основы безопасности](/concepts/security).
- [Защита системы](/learn/deployment/hardening) — ротация и наблюдение.
