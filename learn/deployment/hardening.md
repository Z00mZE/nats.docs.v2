---
id: hardening
title: "Защита системы"
sidebar_position: 6
description: "Защита кластера ORDERS: TLS на каждой связи, учётные данные в файлах и изолированный модуль systemd"
---

# Защита системы {#hardening}

Кластер рассчитан, развёрнут, поддерживает изменение конфигурации и обновления. Но пока он не защищён: маршруты между `n1-east`, `n2-east`, `n3-east` передают открытый текст, порт мониторинга отвечает всем, а процесс `nats-server` может читать и изменять всю файловую систему.

Здесь мы включим TLS на всех связях и запустим процесс в защищённом модуле systemd, лишив его ненужных возможностей. Это эксплуатационные меры. Модель выпуска учётных данных — оператор `ACME`, учётные записи, пользователи — объясняется в [Безопасности](/learn/security). Здесь данные *подключаются*, а транспортная защита *включается*.

## TLS на каждой связи {#tls-on-every-link}

Сервер NATS устанавливает соединения нескольких типов; каждому нужен собственный блок TLS:

- **Клиентский TLS**: блок `tls {}` верхнего уровня защищает, например, публикации `order-svc` в `orders.created`.
- **TLS кластера**: отдельный `cluster { tls {} }` защищает маршруты между `n1-east`, `n2-east`, `n3-east`.
- **TLS шлюзов**: `gateway { tls {} }` защищает связи суперкластера.

Блоки независимы. Включение TLS для клиентов не шифрует маршруты кластера — настройте и их.

Частая ошибка — защитить клиентов и отправить в эксплуатацию кластер, где межузловой трафик Raft, включая репликацию `ORDERS`, остаётся незашифрованным.

Конфигурация, защищающая клиентские и кластерные соединения. Клиентский TLS находится на верхнем уровне, кластерный — внутри `cluster {}`:

```conf
# nats.conf on n1-east — TLS for clients AND for cluster routes
listen: "0.0.0.0:4222"

# Client-facing TLS
tls {
  cert_file: "/var/lib/nats/certs/server-cert.pem"
  key_file:  "/var/lib/nats/certs/server-key.pem"
  ca_file:   "/var/lib/nats/certs/ca.pem"
  verify:    true
}

cluster {
  name: "east"
  listen: "0.0.0.0:6222"
  routes: [
    "nats://n2-east:6222"
    "nats://n3-east:6222"
  ]
  # Cluster-route TLS — separate from the client block above
  tls {
    cert_file: "/var/lib/nats/certs/server-cert.pem"
    key_file:  "/var/lib/nats/certs/server-key.pem"
    ca_file:   "/var/lib/nats/certs/ca.pem"
    verify:    true
  }
}
```

В верхнем `tls {}` параметр `verify: true` включает **mTLS**, взаимную аутентификацию: без него только сервер доказывает свою личность клиенту; с ним клиент обязан предъявить сертификат с цепочкой к `ca_file`. Маршруты кластера и шлюзов всегда используют взаимную проверку независимо от `verify`, поскольку обе стороны выступают и клиентом, и сервером. Поэтому одного адреса маршрута недостаточно для присоединения к `east`: нужен доверенный сертификат. Если идентичность сертификата должна *стать* пользователем NATS, задайте `verify_and_map: true` в клиентском блоке. Этот механизм описан в [Безопасность → Шифрование и TLS](/learn/security/encryption).

При перечитывании сервер заново читает `cert_file` и `key_file`. Для ротации замените файлы и отправьте SIGHUP: перезапуск не нужен. Новые соединения используют новый сертификат, существующие сохраняют сессию. Примените знакомый по [управлению конфигурацией](/learn/deployment/config-management) сигнал:

```bash
# After dropping new cert/key files at the same paths, reload in place.
# Existing connections keep their session; new handshakes pick up the new cert.
systemctl reload nats-server
```

Все параметры TLS, включая наборы шифров, предпочтения кривых и `pinned_certs`, описаны в [Справочнике → TLS](/reference/config/tls). Здесь используются только `cert_file`, `key_file`, `ca_file`, `verify`.

## Подключите учётные данные и проверьте связь {#mount-the-credentials-and-verify-the-link}

TLS шифрует канал, учётные данные определяют пользователя. Оператор `ACME` из [главы безопасности](/learn/security/operator-mode) выдаёт `.creds` для `order-svc`. Здесь мы не создаём его, а подключаем файлом. В Kubernetes это Secret; на хосте — путь, доступный для чтения только пользователю `nats`.

Когда файлы CA и учётных данных доступны, одна публикация проверяет весь защищённый путь. Клиент доверяет CA, предъявляет `order-svc` и публикует заказ в `orders.created`:

<div class="nats-example" data-type="learn-deployment-hardening-credsConnect" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Полезная нагрузка имеет ту же форму заказа Acme, что во всех главах:

```json
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

Успех подтверждает и шифрование, и аутентификацию. Ошибка установления TLS указывает на TLS, ошибка авторизации — на неверные или недоступные учётные данные. Одна команда различает эти случаи.

## Защищённый модуль systemd {#a-hardened-systemd-unit}

TLS защищает кластер от сети, а systemd — хост от процесса: `nats-server` работает без привилегий в изолированной среде с доступом только к необходимому. Дистрибутив NATS содержит `nats-server-hardened.service`; адаптируйте готовый модуль вместо создания с нуля.

Модуль решает три задачи: повышает предел файловых дескрипторов, ограничивает доступ к файловой системе и ядру, удаляет ненужные возможности Linux:

```ini
# /etc/systemd/system/nats-server.service (hardened)
[Service]
ExecStart=/usr/local/bin/nats-server -c /var/lib/nats/nats.conf
ExecReload=/bin/kill -s HUP $MAINPID

# 1. File descriptors: 2 FDs per stream plus gossip and client sockets.
#    A large cluster exhausts the default 1024 quickly.
LimitNOFILE=800000

# 2. Filesystem and kernel sandbox.
ProtectSystem=strict
ReadWritePaths=/var/lib/nats
MemoryDenyWriteExecute=true
ProtectKernelTunables=true
ProtectProc=invisible
PrivateDevices=true

# 3. Drop all capabilities and filter syscalls down to a server profile.
CapabilityBoundingSet=
SystemCallFilter=@system-service ~@privileged ~@resources
```

Особенно важны два параметра. `LimitNOFILE=800000` повышает предел FD значительно выше стандартных 1024. Поток требует около двух FD, а служебный обмен и клиентские сокеты добавляют остальные. `ProtectSystem=strict` делает всю файловую систему доступной только для чтения, кроме путей `ReadWritePaths`. Поэтому хранилище JetStream и сертификаты примера находятся в явно разрешённом для записи `/var/lib/nats`.

Полный набор ограничений — `PrivateUsers`, `RestrictNamespaces`, `ProtectClock` и другие — находится в поставляемом модуле. Скопируйте его и адаптируйте `ExecStart`, `ReadWritePaths`, `LimitNOFILE`. Оборачиваемые им настройки сервера описаны в [Справочнике → Конфигурация](/reference/config).

## Закройте порт мониторинга {#close-the-monitor-port}

Сервер использует четыре порта: **4222** — клиенты, **6222** — маршруты кластера, **7222** — шлюзы, **8222** — HTTP-мониторинг. Первые три используют настроенный TLS. Порт мониторинга выдаёт `/varz`, `/healthz` и другие ответы открытым текстом; `/varz` раскрывает версию сервера, число клиентов и память любому, кто может обратиться к порту.

На отдельном хосте привяжите его к localhost, оставив чтение локальному агенту; остальное ограничьте межсетевым экраном:

```conf
# nats.conf — monitor reachable only from the host itself
http: "127.0.0.1:8222"
```

Не делайте так в развёртывании Kubernetes этой главы. Проверки kubelet обращаются к IP пода, а не к loopback: привязка `127.0.0.1` нарушит все проверки и не позволит подам стать готовыми. В Kubernetes сохраняйте стандартную привязку чарта и ограничивайте доступ через NetworkPolicy.

```bash
# Firewall: clients in, cluster routes between nodes only, monitor never.
# Open 4222 to clients, 6222 to the other east nodes, deny 8222 outright.
ufw allow 4222/tcp
ufw allow from 10.0.0.0/24 to any port 6222 proto tcp
ufw deny 8222/tcp
```

Что собирать из `/varz` и `/healthz` и как это читать, объясняет [Мониторинг → Конечные точки мониторинга](/learn/monitoring/monitoring-endpoints). Здесь достаточно закрыть порт от внешнего мира.

## Типичные ошибки {#pitfalls}

Ловушки связаны с изоляцией systemd и доступом к портам.

**`ProtectSystem=strict` ограничивает запись вне `ReadWritePaths`, но не чтение.** Сервер может прочитать заменённые внешним процессом сертификаты из `/etc/nats-certs` при SIGHUP. Не сработает собственная *запись* сервера за пределами разрешённых путей: `store_dir`, каталоги PID и файла портов должны входить в `ReadWritePaths`, иначе запуск невозможен. Сертификатам достаточно чтения, уже разрешённого `strict`.

**Лимит памяти ниже рабочего набора приводит к OOM под нагрузкой.** `MemoryMax=` systemd задаёт жёсткое ограничение, `GOMEMLIMIT` Go — мягкую цель, усиливающую GC. Ни один не резервирует память при запуске; `max_memory_store` тоже лишь проверяет учёт по мере поступления сообщений. Если `MemoryMax` меньше данных в памяти, буферов соединений и маршрутов вместе с запасом GC, cgroup завершит процесс при росте нагрузки; systemd запишет `Main process killed (oom-kill)`. Устанавливайте `MemoryMax` выше ожидаемого расхода, а `GOMEMLIMIT` несколько ниже, чтобы GC сработал до жёсткого предела.

```ini
# Cap the process above what it uses at peak, not at the config number.
# With jetstream { max_memory_store: 4Gi }, size for the store plus buffers.
MemoryMax=6G
Environment=GOMEMLIMIT=5500MiB
```

**Открытый в интернет мониторинг раскрывает детали системы.** Доступный `:8222/varz` показывает версию, число клиентов и объём памяти — полезные сведения для разведки. На отдельном хосте не оставляйте `http:` на `0.0.0.0`: используйте `127.0.0.1` и блокировку внешнего доступа к 8222.

**Блокировка кластерного порта 6222 не позволяет сформировать кворум.** Закрывая порт от внешнего мира, легко забыть разрешить его *между* узлами `east`. Тогда маршруты не устанавливаются, каждый узел запускается отдельно и не присоединяется к кластеру. Сначала явно разрешите 6222 из подсети кластера, затем запретите остальным:

```bash
# Allow cluster routes between the east nodes; deny 6222 from anywhere else.
ufw allow from 10.0.0.0/24 to any port 6222 proto tcp
ufw deny 6222/tcp
```

После настройки портов и TLS повторите публикацию из [подключения учётных данных и проверки связи](#mount-the-credentials-and-verify-the-link). Успех подтверждает шифрование и аутентификацию. Выполняйте проверку из сети кластера и убедитесь, что маршруты установлены. Если узел всё ещё изолирован, ищите блокировку или отсутствующий либо неподходящий сертификат кластера.

## Что уже готово {#where-you-are}

Кластер `ORDERS` защищён. TLS шифрует соединение `order-svc` и маршруты репликации между `n1-east`, `n2-east`, `n3-east`. Учётные данные `ACME` подключены файлами, публикация проверяет вход и шифрование. Защищённый модуль systemd повышает предел FD и ограничивает файловую систему; на отдельном хосте мониторинг доступен только локально.

Инструкция завершена: кластер рассчитан, развёрнут в Kubernetes, настраивается без простоя, последовательно обновляется и защищён.

## Что дальше {#whats-next}

Последняя страница подводит итоги пяти шагов и собирает типичные ошибки в контрольный список перед признанием кластера готовым.

Перейдите к странице [Куда двигаться дальше](/learn/deployment/where-next).

## См. также {#see-also}

- [Безопасность → Шифрование и TLS](/learn/security/encryption) — идентичность сертификата и `verify_and_map`.
- [Безопасность → Режим оператора](/learn/security/operator-mode) — выпуск учётных данных оператором `ACME`.
- [Мониторинг → Конечные точки мониторинга](/learn/monitoring/monitoring-endpoints) — сбор данных после ограничения доступа к порту.
