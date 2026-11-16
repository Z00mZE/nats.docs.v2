<a id="nats-documentation-rebuild"></a>

# Документация NATS: новая версия

Документация [NATS](https://nats.io), полностью переработанная на основе [Docusaurus](https://docusaurus.io/). Материалы организованы по принципам [Diátaxis](https://diataxis.fr/): основные понятия, практические учебные руководства, подробные статьи Learn и справочник для каждой версии, генерируемый из исходного кода `nats-server` и `jsm.go`. Документацию дополняют интерактивные анимации обмена сообщениями и примеры на нескольких языках из репозиториев клиентов.

<a id="overview"></a>

## Обзор

**Что находится в этом репозитории?**

- Переработанный сайт документации NATS
- Страницы Markdown/MDX с компонентами React
- Справочник, генерируемый для каждой версии NATS из исходного кода вышестоящих проектов
- Сборка статического сайта (`npm run build`), который можно разместить на любом статическом хостинге

**Новым участникам:**

- 📝 **Редактируете документацию?** См. [Типовые задачи](#common-tasks)
- 💻 **Добавляете примеры кода?** См. [Участие в проекте](#contributing)
- 🔧 **Изучаете устройство проекта?** См. [Разработка](#development)
- ❓ **Возникли проблемы?** См. [Устранение неполадок](#troubleshooting)

<a id="table-of-contents"></a>

## Содержание

- [Быстрый старт](#quick-start)
- [Типовые задачи](#common-tasks)
- [Разработка](#development)
- [Участие в проекте](#contributing)
- [Развёртывание](#deployment)
- [Устранение неполадок](#troubleshooting)

<a id="quick-start"></a>

## Быстрый старт

<a id="requirements"></a>

### Требования

- **Node.js** 18 или новее
- **npm** 8 или новее (поставляется с Node.js)

<a id="installation"></a>

### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/nats-io/nats.docs.v2.git
cd nats.docs.v2
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите сервер разработки:

```bash
npm start
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

Сервер разработки поддерживает горячую перезагрузку: большинство изменений появляются сразу, без перезапуска.

<a id="build"></a>

### Сборка

Чтобы создать сборку для публикации:

```bash
npm run build
```

Статические файлы появятся в каталоге `build/`. Их можно разместить на любом статическом хостинге.

### Запуск в Docker

Установите и запустите Docker с поддержкой Linux-контейнеров и Docker Compose.
В корне репозитория выполните:

```bash
task docker:up
```

Или без Task:

```bash
docker compose up --build --detach --wait
```

Откройте [http://localhost:3000](http://localhost:3000). Образ собирает сайт
и загружает примеры кода, затем Nginx обслуживает готовые статические файлы.
Node.js и npm на основной машине не требуются. Первая сборка требует доступа
к реестрам образов, npm и GitHub. Справочник берётся из готовых файлов репозитория,
поэтому инициализировать подмодули для этой сборки не нужно.

Чтобы выбрать другой порт, выполните `task docker:up PORT=3001`. При прямом
запуске Compose задайте переменную окружения `SITE_PORT` или добавьте
`SITE_PORT=3001` в файл `.env`.

```bash
task docker:logs
task docker:down
```

После изменения документации повторите `task docker:up`, чтобы пересобрать образ.
Список команд Task доступен через `task --list`.

<a id="common-tasks"></a>

## Типовые задачи

<a id="editing-documentation-pages"></a>

### Редактирование страниц документации

Страницы документации находятся в каталоге `docs/` и написаны на Markdown (`.md`) или MDX (`.mdx`).

**Чтобы изменить существующую страницу:**

1. Найдите файл в `docs/`, например `docs/concepts/getting-started/index.md`.
2. Внесите изменения.
3. Сохраните файл — благодаря горячей перезагрузке изменения сразу появятся в браузере.
4. Создайте коммит и отправьте изменения.

**Примеры расположения файлов:**

- Начало работы: `docs/concepts/getting-started/index.md`
- Основные понятия: `docs/concepts/*.md`
- Подробные статьи Learn: `learn/<chapter>/*.md` (отдельный раздел документации по адресу `/learn`)
- Учебные руководства: `tutorials/*.md` (отдельный раздел по адресу `/tutorials`)
- Справочник: `reference_versioned_docs/version-<ver>/**` (генерируется автоматически; исправляйте генераторы в `tools/config-generator` и `scripts/`, а не сами страницы)

**Примечание:** каталог `docs/` соответствует корневому пути URL `/`. Например:

- `docs/concepts/getting-started/index.md` → `http://localhost:3000/concepts/getting-started`
- `docs/concepts/publish-subscribe.md` → `http://localhost:3000/concepts/publish-subscribe`

<a id="adding-code-examples"></a>

### Добавление примеров кода

**Где хранятся примеры кода?**

- **Примеры на языках программирования** (Go, Rust, JavaScript, Python, Java, C#) всегда находятся в соответствующих репозиториях клиентов.

  - Go → репозиторий `nats.go`
  - Rust → репозиторий `nats.rs`
  - JavaScript/TypeScript → репозиторий `nats.js`
  - Java → репозиторий `nats.java`

- **Примеры только для CLI** находятся в этом репозитории документации.
  - Путь: `static/examples/snippets/cli/[page]/[snippet].sh`
  - Используйте этот вариант только для примеров без аналогов на языках программирования.

**Два способа добавить примеры:**

**Вариант 1: встроенные примеры** (для уникальных фрагментов, используемых один раз)

Используйте вкладки Docusaurus прямо в файле MDX:

```mdx
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

<Tabs groupId="lang">
<TabItem value="cli" label="CLI" default>

\`\`\`bash
nats pub hello "Hello NATS!"
\`\`\`

</TabItem>
<TabItem value="go" label="Go">

\`\`\`go
nc.Publish("hello", []byte("Hello NATS!"))
\`\`\`

</TabItem>
</Tabs>
```

**Вариант 2: примеры из нескольких репозиториев** (для повторно используемого и проверенного кода; ПРЕДПОЧТИТЕЛЬНЫЙ вариант)

См. раздел [Добавление примеров кода](#adding-code-examples-1) ниже, в описании участия в проекте.

<a id="checking-for-type-errors"></a>

### Проверка ошибок типов

Перед созданием коммита запустите проверку типов TypeScript:

```bash
npm run typecheck
```

<a id="available-npm-commands"></a>

### Доступные команды npm

```bash
npm start              # Запустить сервер разработки (http://localhost:3000)
npm run build          # Собрать сайт для публикации
npm run typecheck      # Проверить типы TypeScript
npm run fetch-examples # Загрузить примеры кода из репозиториев GitHub
npm run generate-docs:all-versions  # Сгенерировать справочник для каждой версии (nats-server + jsm.go)
npm run serve          # Запустить собранный сайт локально
npm run clear          # Очистить кэш Docusaurus
```

<a id="deployment"></a>

## Развёртывание

Команда `npm run build` создаёт полностью статический сайт в `build/`, который можно разместить на любом статическом хостинге. Автоматическое развёртывание через CI в этом репозитории пока не настроено.

Для GitHub Pages подходит встроенная команда развёртывания Docusaurus:

```bash
USE_SSH=true npm run deploy
# или
GIT_USER=<Your GitHub username> npm run deploy
```

<a id="generating-reference-documentation"></a>

### Генерация справочной документации

Справочник генерируется из исходного кода отдельно для каждой версии NATS. Для каждой версии выбираются соответствующие теги подмодулей `nats-server` и `jsm.go` (сопоставление задано в `scripts/doc-versions.json`), разбираются ошибки, заголовки и схемы мониторинга, копируются JSON-схемы и создаётся дерево страниц этой версии.

**Что генерируется для каждой версии:**

- `reference_versioned_docs/version-<ver>/jetstream/errors.md`
- `reference_versioned_docs/version-<ver>/system/errors.md`
- `reference_versioned_docs/version-<ver>/jetstream/api/headers.md`
- `reference_versioned_docs/version-<ver>/config/**` (из `tools/config-generator`)
- `reference_versioned_docs/version-<ver>/**/*` (страницы ссылок на схемы из `scripts/schema-refs.json`)
- `reference_versioned_sidebars/version-<ver>-sidebars.json`
- `src/schemas/vendor/v<ver>/**` (копии JSON-схем)

**Предварительные требования:**

- Go и Node для запуска генераторов
- Инициализированные подмодули `nats-server` и `jsm.go`

```bash
git submodule update --init
```

**Генерация документации:**

```bash
# Сгенерировать все версии из scripts/doc-versions.json
npm run generate-docs:all-versions

# Или одну версию
npm run generate-docs:v2.11
npm run generate-docs:v2.12

# Проверить парсер без записи файлов: только stdout, docs-out не требуется
npm run generate-docs:dry-run
```

**Когда нужна повторная генерация:**

- После изменения тега версии в `scripts/doc-versions.json`
- При добавлении или изменении записей в `scripts/schema-refs.json`
- При изменении шаблонов в `scripts/templates/`
- Перед коммитом изменений справочника

<a id="development"></a>

## Разработка

<a id="technology-stack"></a>

### Технологии

Сайт использует следующие технологии:

- **[Docusaurus](https://docusaurus.io/)** — генератор статических сайтов, предназначенный для документации
- **React** — компоненты интерфейса и интерактивные элементы
- **MDX** — Markdown с JSX для расширенных страниц документации
- **TypeScript** — конфигурация и компоненты с проверкой типов

<a id="project-structure"></a>

### Структура проекта

```
nats.docs.v2/
├── docs/                      # Страницы основных понятий (путь "/")
│   └── concepts/
├── learn/                     # Подробные статьи Learn (отдельный раздел, "/learn")
├── tutorials/                 # Практические учебные руководства (отдельный раздел, "/tutorials")
├── reference_versioned_docs/  # Генерируемый справочник для каждой версии ("/reference")
├── src/
│   ├── components/            # Компоненты React
│   │   └── NatsFlow/          # Интерактивные диаграммы обмена сообщениями
│   ├── plugins/               # Плагины Docusaurus (клиентский модуль NatsFlow)
│   └── css/                   # Глобальные стили
├── static/
│   ├── examples/snippets/
│   │   └── cli/               # Примеры CLI в git; остальные языки загружаются
│   ├── js/
│   │   └── nats-flow-loader.js  # Подключение анимаций NatsFlow на стороне клиента
│   └── img/                   # Изображения и ресурсы
├── scripts/                   # fetch-examples, generate-version, плагины rehype
├── tools/config-generator/    # Генератор дерева справочника конфигурации на Go
├── docusaurus.config.ts       # Конфигурация сайта
├── sidebars.ts                # + sidebars-learn/tutorials/reference.ts
└── package.json               # Зависимости и команды
```

**Важные замечания:**

- Содержимое `docs/` доступно от корневого пути URL (`/`).
- Каталог `static/examples/snippets/cli/` хранится в git; подкаталоги Go/Rust/JS/Python/Java/C# и `metadata.json` загружаются командой `npm run fetch-examples` и исключены из git.
- Плагин `scripts/rehype-nats-example.mjs` преобразует блоки `nats-example` во вкладки языков при сборке. После загрузки новых примеров перезапустите сервер разработки: плагин кэширует `metadata.json`.

<a id="how-code-examples-work"></a>

### Как устроены примеры кода

Документация использует **систему примеров из нескольких репозиториев**:

**Для примеров на языках программирования (Go, Rust, JavaScript, Python, Java, C#):**

1. Примеры находятся в репозиториях клиентов NATS: nats.go, nats.rs, nats.js, nats.py, nats.java и nats.net.
2. Во всех репозиториях примеры размещаются в ветке `doc-examples`.
3. Скрипт `scripts/fetch-examples.js` загружает примеры с GitHub.
4. Файлы сохраняются в `static/examples/snippets/[language]/` и индексируются в `metadata.json`.
5. Плагин `scripts/rehype-nats-example.mjs` создаёт вкладки языков по `metadata.json` при сборке.
6. Страницы используют теги `<div class="nats-example" data-type="..." data-languages="..."></div>`.

**Для примеров CLI:**

1. Фрагменты CLI всегда находятся в этом репозитории по пути `static/examples/snippets/cli/[page]/[snippet].sh` и хранятся в git.
2. Команда `npm run fetch-examples` автоматически добавляет содержимое этого каталога в `metadata.json` вместе с загруженными языками.

**Почему выбран этот подход?**

- **Примеры на языках программирования** — проверенный рабочий код из настоящих клиентских библиотек.
- Примеры можно запускать и проверять в исходных репозиториях.
- Единый источник данных позволяет поддерживать примеры в соответствии с изменениями клиентской библиотеки.
- **Примеры только для CLI** находятся в репозитории документации, поскольку это команды оболочки.

<a id="key-configuration-files"></a>

### Основные файлы конфигурации

**docusaurus.config.ts**

- Основная конфигурация сайта
- Настройки панели навигации и подвала
- Конфигурация плагинов
- Настройки темы
- Конфигурация развёртывания

**sidebars.ts**

- Структура боковой навигации документации
- Порядок и группировка страниц
- Пути к файлам относительно каталога `docs/`

**package.json**

- Зависимости и их версии
- Команды npm (start, build, fetch-examples и другие)
- Метаданные проекта

**scripts/fetch-examples.js**

- Настройки загрузки примеров кода с GitHub
- Сопоставление названий примеров с путями в репозиториях клиентов
- Перечень загружаемых примеров и их расположение

**scripts/rehype-nats-example.mjs**

- Плагин rehype, заменяющий блоки `nats-example` вкладками языков при сборке
- Читает и кэширует `static/examples/snippets/metadata.json`; после `npm run fetch-examples` перезапустите сервер разработки

<a id="branch-strategy-and-prs"></a>

### Ветки и запросы на слияние

**Основные ветки:**

- `main` — ветка для публикации, автоматически развёртывается на GitHub Pages
- Рабочие ветки — создавайте их от `main` для своих изменений

**Порядок работы:**

1. Создайте рабочую ветку: `git checkout -b your-feature-name`.
2. Вносите изменения и регулярно создавайте коммиты.
3. Отправьте ветку на GitHub: `git push origin your-feature-name`.
4. Откройте запрос на слияние в `main`.
5. Для запроса автоматически появится адрес предварительного просмотра Netlify.
6. После проверки и одобрения выполните слияние в `main`.
7. Изменения автоматически публикуются на основном сайте.

**Примеры кода в репозиториях клиентов:**
Все примеры должны находиться в ветке `doc-examples` соответствующего репозитория (nats.go, nats.rs, nats.js).

<a id="what-not-to-commit"></a>

### Что не следует добавлять в коммиты

**Генерируемые файлы, исключённые через .gitignore:**

- `static/examples/snippets/go/` — загружается из nats.go
- `static/examples/snippets/rust/` — загружается из nats.rs
- `static/examples/snippets/javascript/` — загружается из nats.js
- `static/examples/snippets/metadata.json` — создаётся скриптом загрузки
- `build/` — результат сборки для публикации
- `.docusaurus/` — кэш Docusaurus
- `node_modules/` — зависимости npm

**Файлы, которые СЛЕДУЕТ добавлять в коммиты:**

- Страницы документации в `docs/`
- Компоненты React в `src/`
- Примеры CLI в `static/examples/snippets/cli/` — их исходные файлы хранятся здесь
- Файлы конфигурации (`docusaurus.config.ts`, `sidebars.ts` и другие)
- Статические ресурсы в `static/`: изображения, шрифты и прочее

**Важно:** структура каталога `static/examples/snippets/`:

```
static/examples/snippets/
├── cli/              # ✅ COMMIT - CLI examples (source of truth)
│   └── [page]/
│       └── [snippet].sh
├── go/               # ❌ DON'T COMMIT - Fetched from nats.go repo
├── rust/             # ❌ DON'T COMMIT - Fetched from nats.rs repo
├── javascript/       # ❌ DON'T COMMIT - Fetched from nats.js repo
├── python/ java/ csharp/  # ❌ DON'T COMMIT - Fetched from nats.py / nats.java / nats.net
└── metadata.json     # ❌ DON'T COMMIT - Generated by fetch script
```

**Где находятся примеры на языках программирования:**

- Go: `nats.go` · Rust: `nats.rs` · JavaScript/TypeScript: `nats.js` · Python: `nats.py` · Java: `nats.java` · C#: `nats.net` — во всех случаях используется ветка `doc-examples`

<a id="writing-documentation"></a>

### Написание документации

**Формат файлов:**

- Используйте `.md` для простых страниц с обычным Markdown.
- Используйте `.mdx` для страниц с компонентами React: вкладками, анимациями NatsFlow и другими.

**Метаданные в начале файла:**
Каждая страница документации должна начинаться с блока метаданных:

```yaml
---
title: Page Title
sidebar_label: Короткая подпись # Необязательно, для боковой навигации
---
```

**Рекомендации:**

- **Начинайте с простого:** сначала объясняйте основные понятия, затем детали.
- **Показывайте на примерах:** иллюстрируйте понятия кодом и анимациями.
- **Соблюдайте единый стиль:** следуйте руководству [CLAUDE.md](./CLAUDE.md).
- **Добавляйте ссылки:** связывайте близкие понятия внутренними ссылками.
- **Проверяйте примеры:** весь код должен запускаться и проходить проверку.
- **Используйте активный залог:** «NATS доставляет сообщения» вместо «Сообщения доставляются системой NATS».
- **Поддерживайте актуальность:** используйте реалистичные примеры с `demo.nats.io`.

**Порядок языков в примерах кода:**
Всегда показывайте примеры в следующем порядке: CLI, JavaScript/TypeScript, Go, Python, Java, Rust, C#/.NET.

**Когда использовать анимации NatsFlow:**

- Схемы обмена сообщениями: pub/sub, request/reply
- Временные диаграммы и диаграммы последовательностей
- Визуализация рассылки и балансировки нагрузки

**Когда использовать примеры кода:**

- Синтаксис и использование API
- Примеры конфигурации
- Пошаговые учебные руководства

<a id="contributing"></a>

## Участие в проекте

<a id="adding-code-examples-1"></a>

### Добавление примеров кода

Сайт использует **систему примеров из нескольких репозиториев**: примеры загружаются из репозиториев клиентов NATS. Благодаря этому документация содержит проверенный рабочий код.

**Основной принцип:**

- **Примеры на языках программирования** (Go, Rust, JavaScript, Python, Java, C#) → всегда добавляйте в соответствующие репозитории клиентов.
- **Примеры только для CLI**, без вариантов на языках программирования → добавляйте в этот репозиторий документации.

Если пример включает CLI, Go, Rust и JavaScript, часть CLI помещается в этот репозиторий (`static/examples/snippets/cli/`), а Go/Rust/JS — в репозитории соответствующих клиентов.

<a id="repository-setup"></a>

#### Подготовка репозиториев

Для удобства клонируйте репозитории клиентов рядом с репозиторием документации:

```bash
~/coding/
├── nats.docs.v2/            # Этот репозиторий
├── nats.go-docs/            # Примеры Go
├── nats.rs-docs/            # Примеры Rust
└── nats.js-docs/            # Примеры JavaScript/TypeScript
```

Клонируйте репозитории:

```bash
cd ~/coding
git clone https://github.com/nats-io/nats.go nats.go-docs
git clone https://github.com/nats-io/nats.rs nats.rs-docs
git clone https://github.com/nats-io/nats.js nats.js-docs
```

В каждом переключитесь на ветку `doc-examples`:

```bash
cd nats.go-docs && git checkout -b doc-examples origin/doc-examples
cd ../nats.rs-docs && git checkout -b doc-examples origin/doc-examples
cd ../nats.js-docs && git checkout -b doc-examples origin/doc-examples
```

<a id="example-naming-convention"></a>

#### Имена примеров

Имена примеров имеют формат `[page]-[snippet]`:

- `getting-started-publish` — пример публикации на странице начала работы
- `basics-subscribe` — пример подписки на странице основ

<a id="adding-examples-for-each-language"></a>

#### Добавление примеров для каждого языка

<a id="cli-examples-local"></a>

##### Примеры CLI (локальные)

Примеры CLI хранятся локально в этом репозитории. К ним относятся:

- Части CLI в примерах на нескольких языках
- Примеры только для CLI, без аналогов на языках программирования

**Расположение:**

```bash
static/examples/snippets/cli/[page]/[snippet].sh
```

**Пример:**

```bash
# static/examples/snippets/cli/getting-started/publish.sh
#!/bin/bash

# Опубликовать сообщение на demo.nats.io
nats pub --server=demo.nats.io hello "Hello NATS!"
```

**После создания примеров CLI:**

- Добавьте их в коммит непосредственно в этом репозитории; они не загружаются с GitHub.
- Отдельная ветка в другом репозитории не требуется.
- Создайте коммит и отправьте его в свою рабочую ветку этого репозитория.

<a id="go-examples"></a>

##### Примеры Go

**Репозиторий:** `nats.go` (клонирован в `~/coding/nats.go-docs`)
**Ветка:** `doc-examples`
**Расположение:** `~/coding/nats.go-docs/examples/docs/[page]-[snippet]/main.go`

```go
// examples/docs/getting-started-publish/main.go
package main

import (
	"log"
	"github.com/nats-io/nats.go"
)

func main() {
	// Подключиться к демонстрационному серверу NATS
	nc, err := nats.Connect("demo.nats.io")
	if err != nil {
		log.Fatal(err)
	}
	defer nc.Close()

	// Опубликовать сообщение
	err = nc.Publish("hello", []byte("Hello NATS!"))
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Message published to hello")
}
```

После создания примеров:

```bash
cd ~/coding/nats.go-docs
go fmt ./examples/docs/getting-started-publish/main.go
git add examples/docs/getting-started-publish/
git commit -m "Add getting-started-publish example"
git push origin doc-examples
```

<a id="rust-examples"></a>

##### Примеры Rust

**Репозиторий:** `nats.rs` (клонирован в `~/coding/nats.rs-docs`)
**Ветка:** `doc-examples`
**Расположение:** `~/coding/nats.rs-docs/async-nats/examples/docs_[page]_[snippet].rs`

**Примечание:** в именах файлов используйте подчёркивания вместо дефисов.

```rust
// async-nats/examples/docs_getting_started_publish.rs
use async_nats;

#[tokio::main]
async fn main() -> Result<(), async_nats::Error> {
    // Подключиться к демонстрационному серверу NATS
    let client = async_nats::connect("demo.nats.io").await?;

    // Опубликовать сообщение
    client.publish("hello", "Hello NATS!".into()).await?;
    client.flush().await?;

    println!("Message published to hello");

    Ok(())
}
```

После создания примеров:

```bash
cd ~/coding/nats.rs-docs/async-nats
cargo +nightly fmt
cd ..
git add async-nats/examples/docs_getting_started_publish.rs
git commit -m "Add getting-started-publish example"
git push origin doc-examples
```

<a id="javascripttypescript-examples"></a>

##### Примеры JavaScript/TypeScript

**Репозиторий:** `nats.js` (клонирован в `~/coding/nats.js-docs`)
**Ветка:** `doc-examples`
**Расположение:** `~/coding/nats.js-docs/examples/docs/[page]-[snippet]/index.ts`

```typescript
// examples/docs/getting-started-publish/index.ts
// Импортировать функцию connect из транспортного модуля
import { connect } from "@nats-io/transport-deno";

// Подключиться к демонстрационному серверу NATS
const nc = await connect({ servers: "demo.nats.io:4222" });

// Опубликовать сообщение в теме 'hello'
nc.publish("hello", "Hello NATS!");
console.log("Message published to hello");

// Завершить обработку соединения: отправить буфер и закрыть его
await nc.drain();
```

После создания примеров:

```bash
cd ~/coding/nats.js-docs
git add examples/docs/getting-started-publish/
git commit -m "Add getting-started-publish example"
git push origin doc-examples
```

<a id="using-nats-doc-markers-optional"></a>

#### Использование маркеров NATS-DOC (необязательно)

Если пример требует подготовительного кода, но в документации нужно показать только определённый фрагмент:

```go
func main() {
    // Здесь находится подготовительный код
    nc, _ := nats.Connect("demo.nats.io")
    defer nc.Close()

    // NATS-DOC-START
    // Этот код будет извлечён
    nc.Publish("hello", []byte("Hello!"))
    // NATS-DOC-END

    // Здесь находится остальной код
}
```

Если маркеров нет, используется весь файл. Это рекомендуемый вариант для примеров начала работы.

<a id="registering-examples"></a>

#### Регистрация примеров

Добавьте свои примеры в `scripts/fetch-examples.js`:

```javascript
const EXAMPLES_CONFIG = {
  go: {
    examples: {
      "getting-started-publish":
        "examples/docs/getting-started-publish/main.go",
      // ... добавьте остальные примеры
    },
  },
  rust: {
    examples: {
      "getting-started-publish":
        "async-nats/examples/docs_getting_started_publish.rs",
      // ... добавьте остальные примеры
    },
  },
  javascript: {
    examples: {
      "getting-started-publish":
        "examples/docs/getting-started-publish/index.ts",
      // ... добавьте остальные примеры
    },
  },
};
```

<a id="fetching-examples"></a>

#### Загрузка примеров

После отправки примеров на GitHub загрузите их в этот репозиторий:

```bash
npm run fetch-examples
```

Команда загружает примеры с GitHub и сохраняет их в `static/examples/snippets/`.

<a id="using-examples-in-documentation"></a>

#### Использование примеров в документации

В файлах MDX:

```mdx
### Пример издателя

<div
  class="nats-example"
  data-type="getting-started-publish"
  data-languages="cli,js,go,java,rust,csharp"
></div>
```

Языки отображаются в указанном порядке. CLI всегда должен идти первым и иметь атрибут `default`.

<a id="complete-workflow"></a>

#### Полный порядок работы

**Для примеров на нескольких языках (CLI + Go + Rust + JS):**

1. **Создайте пример CLI** в этом репозитории: `static/examples/snippets/cli/[page]/[snippet].sh`.
2. **Создайте пример Go** в `~/coding/nats.go-docs`, в ветке `doc-examples`.
3. **Создайте пример Rust** в `~/coding/nats.rs-docs`, в ветке `doc-examples`.
4. **Создайте пример JavaScript** в `~/coding/nats.js-docs`, в ветке `doc-examples`.
5. **Отформатируйте код** в каждом репозитории (go fmt, cargo fmt и так далее).
6. **Создайте коммиты и отправьте** пример CLI в этот репозиторий, остальные примеры — в ветки `doc-examples` репозиториев клиентов.
7. **Обновите** `scripts/fetch-examples.js`, зарегистрировав новые примеры Go/Rust/JS.
8. **Загрузите примеры:** `npm run fetch-examples` получает Go/Rust/JS с GitHub.
9. **Добавьте их в документацию:** `<div class="nats-example" data-type="..." data-languages="cli,js,go,java,rust,csharp"></div>`.
10. **Проверьте локально:** запустите `npm start` и убедитесь, что все вкладки отображаются правильно.

**Для примеров только для CLI:**

1. **Создайте пример CLI** в этом репозитории: `static/examples/snippets/cli/[page]/[snippet].sh`.
2. **Создайте коммит и отправьте** его в этот репозиторий.
3. **Добавьте пример в документацию:** `<div class="nats-example" data-type="..." data-languages="cli"></div>`.
4. **Проверьте локально:** запустите `npm start` и убедитесь, что пример отображается.

<a id="style-guide"></a>

### Руководство по стилю

Подробные правила оформления документации находятся в [CLAUDE.md](./CLAUDE.md) и включают:

- Структуру примеров кода
- Порядок вкладок: CLI, JavaScript/TypeScript, Go, Python, Java, Rust, C#/.NET
- Стиль комментариев
- Выбор между анимациями NatsFlow и примерами кода

<a id="troubleshooting"></a>

## Устранение неполадок

<a id="development-server-wont-start"></a>

### Сервер разработки не запускается

**Проблема:** `npm start` завершается с ошибкой или сообщает о конфликте портов.

**Решения:**

1. Проверьте, не занят ли порт 3000:
   ```bash
   lsof -i :3000
   ```
2. Завершите уже работающий процесс:
   ```bash
   lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
   ```
3. Очистите кэш Docusaurus и повторите попытку:
   ```bash
   npm run clear
   npm start
   ```

<a id="code-examples-not-appearing"></a>

### Примеры кода не отображаются

**Проблема:** вместо тегов `<div class="nats-example">` появляется сообщение об отсутствии примеров («No examples available»).

**Возможные причины и решения:**

1. **Примеры не загружены с GitHub:**

   ```bash
   npm run fetch-examples
   ```

   Убедитесь, что файл `static/examples/snippets/metadata.json` существует и содержит ваш пример.

2. **Неверный атрибут data-type:**
   Убедитесь, что `data-type` совпадает с именем примера в `scripts/fetch-examples.js`. Например, для `"getting-started-publish"` используйте:

   ```html
   <div class="nats-example" data-type="getting-started-publish" ...></div>
   ```

3. **Отсутствуют примеры CLI:**
   Они хранятся в этом репозитории по пути `static/examples/snippets/cli/[page]/[snippet].sh`.

   Если пример CLI не отображается:

   - Проверьте наличие файла `static/examples/snippets/cli/[page]/[snippet].sh`.
   - Убедитесь, что файл добавлен в git: примеры CLI должны храниться в репозитории.
   - Повторно запустите `npm run fetch-examples`, чтобы добавить каталог CLI в `metadata.json`, затем перезапустите сервер разработки: плагин rehype кэширует `metadata.json`.

<a id="type-checking-errors"></a>

### Ошибки проверки типов

**Проблема:** `npm run typecheck` сообщает об ошибках.

**Решения:**

1. Убедитесь, что в `docusaurus.config.ts` и остальных файлах TypeScript используются правильные типы.
2. Проверьте импорты в MDX: для абсолютных импортов используйте префикс `@site/`:
   ```typescript
   import { NatsFlow } from "@site/src/components/NatsFlow";
   ```
3. Если после исправления ошибки остаются, перезапустите сервер TypeScript в своей IDE.

<a id="hot-reload-not-working"></a>

### Горячая перезагрузка не работает

**Проблема:** изменения файлов не появляются в браузере.

**Решения:**

1. Перезапустите сервер разработки: `Ctrl+C`, затем `npm start`.
2. Выполните полное обновление страницы: `Cmd+Shift+R` в macOS или `Ctrl+Shift+R` в Windows/Linux.
3. Проверьте терминал на ошибки сборки.
4. Очистите кэш командой `npm run clear`, затем запустите `npm start`.

<a id="build-fails"></a>

### Ошибка сборки

**Проблема:** `npm run build` завершается с ошибкой.

**Частые причины:**

1. **Неработающие ссылки:** проверьте внутренние ссылки в файлах Markdown.
2. **Ошибки типов:** запустите `npm run typecheck`.
3. **Отсутствующие зависимости:** выполните `npm install`, чтобы установить все пакеты.
4. **Проблемы с примерами кода:** обновите их командой `npm run fetch-examples`.

<a id="examples-not-updating-after-push-to-client-repo"></a>

### Примеры не обновляются после отправки в репозиторий клиента

**Проблема:** новые примеры отправлены, но в документации не появились.

**Для примеров на языках программирования (Go, Rust, JavaScript, Python, Java, C#):**
Примеры загружаются с GitHub. Выполните следующие действия:

1. Отправьте изменения в ветку `doc-examples` репозитория клиента (nats.go, nats.rs или nats.js).
2. Дождитесь обработки изменений на GitHub.
3. Запустите `npm run fetch-examples` в этом репозитории, чтобы загрузить обновления с GitHub.
4. Обновите страницу в браузере.

**Примечание:** скрипт использует адреса исходных файлов GitHub, поэтому изменения станут доступны только после отправки.

**Для примеров CLI:**
Они находятся непосредственно в этом репозитории, в `static/examples/snippets/cli/`, и не требуют загрузки:

1. Добавьте пример CLI в коммит этого репозитория.
2. Изменения появляются сразу после сохранения благодаря горячей перезагрузке.
3. При изменениях только CLI запуск `npm run fetch-examples` не требуется.

<a id="interactive-animations-natsflow-not-working"></a>

### Интерактивные анимации NatsFlow не работают

**Проблема:** блок `<div class="nats-flow" data-scenario="...">` не отображается.

**Решения:**

1. Проверьте имя `data-scenario`: сценарии `*Animated` должны экспортироваться из `src/components/NatsFlow/scenarios/index.ts` и регистрироваться в `src/plugins/nats-flow/client-module.tsx`.
2. Проверьте консоль браузера на ошибки JavaScript.
3. Полное руководство по созданию и подключению сценариев находится в `src/components/NatsFlow/README.md`.

<a id="getting-help"></a>

### Где искать помощь

- Изучите [документацию Docusaurus](https://docusaurus.io/docs).
- Ознакомьтесь с правилами оформления в [CLAUDE.md](./CLAUDE.md).
- Посмотрите примеры на существующих страницах документации.
- Устройство компонентов анимации описано в `src/components/NatsFlow/README.md`.

<a id="license-and-attribution"></a>

## Лицензия и указание авторства

Оригинальный код и документация этого репозитория распространяются по [лицензии MIT](./LICENSE).

Часть материалов основана на вышестоящих проектах с лицензией Apache-2.0 и сохраняет эту лицензию. Подробности приведены в [NOTICE](./NOTICE), текст лицензии — в [LICENSE-APACHE](./LICENSE-APACHE):

- Материалы документации на основе [nats-io/nats.docs](https://github.com/nats-io/nats.docs)
- Справочная документация и JSON-схемы, сгенерированные из [nats-io/nats-server](https://github.com/nats-io/nats-server) и [nats-io/jsm.go](https://github.com/nats-io/jsm.go)
