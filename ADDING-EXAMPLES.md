<a id="adding-code-examples-to-nats-documentation"></a>

# Добавление примеров кода в документацию NATS

Краткая инструкция по добавлению примеров с помощью системы nats-example.

<a id="tldr"></a>

## Краткий порядок действий

```bash
# 1. Создайте пример CLI в этом репозитории
echo '#!/bin/bash
nats pub subject "message"' > static/examples/snippets/cli/[page]/[snippet].sh

# 2. ВАЖНО: добавьте файл в git!
git add static/examples/snippets/cli/[page]/[snippet].sh

# 3. Создайте пример Go в репозитории nats.go-docs
cd ~/coding/nats.go-docs
# Создайте examples/docs/[page]-[snippet]/main.go с маркерами NATS-DOC-START/END
git add examples/docs/[page]-[snippet]/
git commit -m "Add [page]-[snippet] example"
git push origin doc-examples

# 4. Создайте пример Rust в репозитории nats.rs-docs
cd ~/coding/nats.rs-docs
# Создайте async-nats/examples/docs_[page]_[snippet].rs с маркерами NATS-DOC-START/END
git add async-nats/examples/docs_[page]_[snippet].rs
git commit -m "Add [page]-[snippet] example"
git push origin doc-examples

# 5. Обновите конфигурацию загрузки и проверьте локально
cd ~/coding/new-nats.docs
# Добавьте записи в scripts/fetch-examples.js
npm run fetch-examples

# 6. Используйте пример в документации
# <div class="nats-example" data-type="[page]-[snippet]" data-languages="cli,js,go,python,java,rust,csharp"></div>
```

<a id="directory-structure"></a>

## Структура каталогов

```
# Примеры CLI: хранятся в git в этом репозитории
static/examples/snippets/cli/
  ├── queue-groups/
  │   ├── basic.sh
  │   └── dynamic-scaling.sh
  ├── request-reply/
  │   ├── basic.sh
  │   └── timeout.sh
  └── subjects/
      └── monitoring.sh

# Примеры Go: загружаются из nats.go при сборке
~/coding/nats.go-docs/examples/docs/
  ├── queue-groups-basic/main.go
  ├── queue-groups-dynamic-scaling/main.go
  ├── request-reply-basic/main.go
  └── request-reply-timeout/main.go

# Примеры Rust: загружаются из nats.rs при сборке
~/coding/nats.rs-docs/async-nats/examples/
  ├── docs_queue_groups_basic.rs
  ├── docs_queue_groups_dynamic_scaling.rs
  ├── docs_request_reply_basic.rs
  └── docs_request_reply_timeout.rs
```

<a id="naming-convention"></a>

## Правила именования

Имена примеров имеют формат `[page]-[snippet]`.

- **Страница документации:** `queue-groups`
- **Фрагмент примера:** `basic`
- **Тип примера:** `queue-groups-basic`

<a id="language-specific-paths"></a>

### Пути для разных языков

| Язык | Шаблон пути | Пример |
|----------|-------------|---------|
| CLI | `cli/[page]/[snippet].sh` | `cli/queue-groups/basic.sh` |
| Go | `[page]-[snippet]/main.go` | `queue-groups-basic/main.go` |
| Rust | `docs_[page]_[snippet].rs` | `docs_queue_groups_basic.rs` |

<a id="step-by-step-walkthrough"></a>

## Пошаговое руководство

<a id="1-create-cli-example"></a>

### 1. Создайте пример CLI

```bash
# Примеры CLI находятся в этом репозитории
mkdir -p static/examples/snippets/cli/queue-groups
cat > static/examples/snippets/cli/queue-groups/basic.sh << 'EOF'
#!/bin/bash

# Терминал 1: обработчик подписывается на очередь
nats sub tasks --queue workers

# Терминал 2: публикация заданий
nats pub tasks "Process this"
EOF

# ОБЯЗАТЕЛЬНО добавьте в git: примеры CLI должны храниться в репозитории
git add static/examples/snippets/cli/queue-groups/basic.sh
```

<a id="2-create-go-example"></a>

### 2. Создайте пример Go

```bash
cd ~/coding/nats.go-docs
git checkout doc-examples

mkdir -p examples/docs/queue-groups-basic
cat > examples/docs/queue-groups-basic/main.go << 'EOF'
package main

import (
    "fmt"
    "github.com/nats-io/nats.go"
)

func main() {
    nc, _ := nats.Connect(nats.DefaultURL)
    defer nc.Close()

    // NATS-DOC-START
    nc.QueueSubscribe("tasks", "workers", func(m *nats.Msg) {
        fmt.Printf("Processing: %s\n", string(m.Data))
    })

    nc.Publish("tasks", []byte("Process this"))
    // NATS-DOC-END
}
EOF

git add examples/docs/queue-groups-basic/
git commit -m "Add queue-groups-basic example"
git push origin doc-examples
```

<a id="3-create-rust-example"></a>

### 3. Создайте пример Rust

```bash
cd ~/coding/nats.rs-docs
git checkout doc-examples

cat > async-nats/examples/docs_queue_groups_basic.rs << 'EOF'
use async_nats;
use futures::StreamExt;

#[tokio::main]
async fn main() -> Result<(), async_nats::Error> {
    let client = async_nats::connect("localhost:4222").await?;

    // NATS-DOC-START
    let mut sub = client.queue_subscribe("tasks", "workers").await?;
    tokio::spawn(async move {
        while let Some(msg) = sub.next().await {
            println!("Processing: {}", String::from_utf8_lossy(&msg.payload));
        }
    });

    client.publish("tasks", "Process this".into()).await?;
    // NATS-DOC-END

    Ok(())
}
EOF

git add async-nats/examples/docs_queue_groups_basic.rs
git commit -m "Add queue-groups-basic example"
git push origin doc-examples
```

<a id="4-update-fetch-configuration"></a>

### 4. Обновите конфигурацию загрузки

```bash
cd ~/coding/new-nats.docs

# Отредактируйте scripts/fetch-examples.js
# Добавьте в раздел "go":
"queue-groups-basic": "examples/docs/queue-groups-basic/main.go",

# Добавьте в раздел "rust":
"queue-groups-basic": "async-nats/examples/docs_queue_groups_basic.rs",
```

<a id="5-test-locally"></a>

### 5. Проверьте локально

```bash
# Загрузите примеры с GitHub
npm run fetch-examples

# Ожидаемый вывод:
# ✓ queue-groups-basic -> queue-groups/basic.go
# ✓ queue-groups-basic -> queue-groups/basic.rs
# ✓ queue-groups-basic -> queue-groups/basic.sh
```

<a id="6-use-in-documentation"></a>

### 6. Используйте в документации

```mdx
## Группы очередей

Basic queue group example:

<div class="nats-example" data-type="queue-groups-basic" data-languages="cli,js,go,python,java,rust,csharp"></div>
```

<a id="common-issues"></a>

## Частые проблемы

<a id="cli-example-not-showing-in-production"></a>

### Пример CLI не отображается на опубликованном сайте

**Проблема:** пример CLI создан, но отсутствует на сайте.
**Решение:** примеры CLI должны быть добавлены в коммит git.
```bash
git add static/examples/snippets/cli/[page]/[snippet].sh
git commit -m "Add CLI example"
```

<a id="gorust-example-not-showing"></a>

### Пример Go/Rust не отображается

**Проблема:** пример существует, но не загружается.
**Решение:**
1. Убедитесь, что он отправлен в ветку `doc-examples` на GitHub.
2. Убедитесь, что он зарегистрирован в `scripts/fetch-examples.js`.
3. Запустите `npm run fetch-examples` для локальной проверки.

<a id="example-shows-wrong-code"></a>

### В примере отображается неверный код

**Проблема:** отображается старая версия.
**Решение:** очистите кэш сборки и повторно загрузите примеры.
```bash
rm -rf static/examples/snippets/go static/examples/snippets/rust
npm run fetch-examples
```

<a id="key-differences-cli-vs-other-languages"></a>

## Различия между CLI и другими языками

| Аспект | Примеры CLI | Другие языки (Go/Rust/JS и прочие) |
|--------|--------------|----------------------------------|
| **Расположение** | Этот репозиторий | Репозитории клиентов: nats.go, nats.rs и другие |
| **Хранение** | В коммитах git | Загружаются при сборке |
| **Путь** | `static/examples/snippets/cli/` | `static/examples/snippets/{go,rust,javascript,python,...}/` |
| **Когда добавлять** | Сразу выполнить `git add` | Отправить в репозиторий клиента, затем загрузить |
| **gitignore** | Не исключены благодаря исключению | Все исключены правилом `static/examples/snippets/*` |
| **Новые языки** | Ничего не меняется | Автоматически исключаются при добавлении |

<a id="documentation"></a>

## Документация

- Полный порядок работы: `static/examples/snippets/cli/README.md`
- Руководство по стилю: `CLAUDE.md`
- Скрипт загрузки: `scripts/fetch-examples.js`
