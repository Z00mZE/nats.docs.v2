---
id: tls-and-auth
title: "TLS и аутентификация"
sidebar_position: 8
description: "Безопасный order-svc с файлом creds и проверкой сертификата CA кластера"
---

# TLS и аутентификация {#tls--auth}

Связь уже восстанавливается, завершается и повторяет запросы, но открыта и анонимна. Это непригодно для эксплуатации.

Клиент **использует** готовые creds и CA. Здесь их загрузка, не выпуск; создание JWT и CA — [Безопасность](/learn/security).

## Загрузка creds {#consuming-a-credentials-file}

Файл .creds содержит JWT order-svc и закрытый NKey seed. Передайте путь библиотеке, не разбирайте вручную. Другие виды входа — [Основы аутентификации](/learn/security/authentication-basics).

В [handshake](/learn/resilient-clients/connecting) INFO с auth_required несёт случайный nonce. Клиент подписывает seed, передаёт подпись и JWT в CONNECT. Сервер сверяет открытый ключ; пароль по сети не идёт.

Добавьте --creds. Библиотеки обычно читают путь, nats.js — содержимое байтами.

<div class="nats-example" data-type="learn-resilient-clients-tls-and-auth-connect-creds" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Прежнее событие заказа:

```json
{"order_id":"ord_8w2k","customer":"acme-co","total_cents":4200,"ts":"2026-05-22T10:14:22Z"}
```

JWT называет, seed доказывает. User/password не нужны. Файл — секрет: владелец входит как order-svc. Загружайте с диска или окружения, не вставляйте в код.

## CA и TLS {#trusting-a-ca-and-the-tls-handshake}

Аутентификация клиента не шифрует байты. TLS защищает их и доказывает подлинность сервера.

Клиенту нужен **сертификат CA**. При handshake проверяется цепочка серверного сертификата; при отказе соединение прерывается до передачи данных входа.

Обычно порядок: TCP, открытый INFO с tls_required, TLS и проверка CA, затем зашифрованный CONNECT с creds. Handshake_first/--tlsfirst переносит TLS перед INFO. Обе стороны должны согласовать: tlsfirst против обычного сервера даёт TLS-ошибку, обычный клиент против TLS-first ждёт до тайм-аута/EOF.

Добавьте --tlsca и URL tls://. Большинство библиотек принимает PEM, Python/Java — созданный TLS-контекст с CA.

<div class="nats-example" data-type="learn-resilient-clients-tls-and-auth-connect-tls" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

Для WebSocket защищённая схема wss://; см. [WebSocket](/learn/websocket/).

Схема: INFO → TLS/CA → CONNECT → PONG, с веткой отказа.

<div class="nats-flow" data-scenario="tlsAuthHandshakeAnimated" data-width="600" data-height="350"></div>

**MTLS** добавляет сертификат и ключ клиента рядом с CA. Требование и отображение личности задаются сервером в [Шифровании и TLS](/learn/security/encryption).

Точные опции загрузки — в API библиотеки, протокол — в [справочнике](/reference/).

## Ошибки входа при восстановлении {#auth-errors-during-reconnect}

Повтор сетевого dial из [Переподключения](/learn/resilient-clients/reconnection) полезен, но одинаковые неверные данные вновь отклонятся. Многие клиенты после первого отказа пробуют ещё, после повторного прекращают.

Go закрывает при одинаковой ошибке дважды от одного сервера, кроме IgnoreAuthErrorAbort(). JS — две подряд, кроме ignoreAuthErrorAbort. .NET аналогично, Java — дважды от того же сервера. Это сильнее бесконечного MaxReconnect. Python/Rust считают обычные неудачные попытки: до max_reconnect_attempts, стандарт 60, либо max_reconnects, стандарт бесконечно, с событиями ошибок.

У первых четырёх истёкшие или отозванные creds приводят к CLOSED, в .NET Failed. [Наблюдатель закрытия](/learn/resilient-clients/connection-events) должен запросить новые данные или перезапуск. CLI включает IgnoreAuthErrorAbort и бесконечные повторы, поэтому ведёт себя иначе.

Первая повторная попытка полезна при ротации или отстающем auth-состоянии. Надёжно обновлять через callback каждого connect/reconnect: Go UserJWT(userCB, sigCB)/Nkey, JS authenticator с nonce, Python user_jwt_cb/signature_cb, Java AuthHandler, Rust ConnectOptions::with_auth_callback, .NET NatsAuthOpts.AuthCredCallback. Go/Java/Python перечитывают путь creds каждый раз; JS/Rust/.NET загружают один раз и требуют callback для ротации.

## Типичные ошибки {#pitfalls}

Ошибки creds и CA:

**Секрет в коде.** Он попадает в git и требует развёртывания для ротации. Файл или окружение, никогда .creds в исходниках.

**Отключение проверки сервера.** Skip-verify принимает поддельный сертификат. При эксплуатации доверенный CA обязателен: одно шифрование с неизвестной стороной не защищает.

**Истечение закрывает живую связь.** Сервер в срок JWT отправляет `-ERR 'User Authentication Expired'`, затем reconnect получает Authorization Violation и по [правилу повторных auth-ошибок](#auth-errors-during-reconnect) может окончательно остановиться. Наблюдайте error и closed, обновляйте заранее через callback или файл.

**Ротация требует нового соединения.** Уже открытое сохраняет прежнюю личность. Go/Java/Python перечитают файл при reconnect, JS/Rust/.NET требуют callback. Go при частично записанном файле получает локальную ошибку разбора, не посылает CONNECT и повторяет до готовности: записывайте временный файл и атомарно переименовывайте. Безопасная ротация — новое соединение с новыми данными и [drain старого](/learn/resilient-clients/drain-and-shutdown).

Различайте недоверенный CA и неверные/истёкшие/отозванные данные, а не сводите к сети:

<div class="nats-example" data-type="learn-resilient-clients-tls-and-auth-handle-auth-error" data-languages="cli,js,go,python,java,rust,csharp,c"></div>

## Что уже готово {#where-you-are}

Order-svc имеет:

- Creds с JWT и подписью nonce без пароля.
- Проверку CA до секретов и шифрование.
- Обработку повторных auth-ошибок и обновление callback.
- Понимание mTLS и серверной настройки.

Соединение именовано, имеет пул, восстановление, события, drain, ограничения, безопасные запросы и TLS.

## Что дальше {#whats-next}

Итоговая страница собирает автомат и проверки и указывает серверные причины, позиции JetStream и выпуск creds/CA.

Перейдите к [итогам](/learn/resilient-clients/where-next).

## См. также {#see-also}

- [Основы аутентификации](/learn/security/authentication-basics) — выпуск и типы данных.
- [Шифрование и TLS](/learn/security/encryption) — сервер и mTLS.
- [Подключение](/learn/resilient-clients/connecting) — INFO и handshake.
