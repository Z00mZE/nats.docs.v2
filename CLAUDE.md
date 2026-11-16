<a id="nats-documentation-style-guide"></a>

# Руководство по стилю документации NATS

> Руководство для ИИ-помощников по поддержанию единого стиля документации NATS.

<a id="must-rules-non-negotiable"></a>

## 🔴 Обязательные правила

<a id="code-example-tabs"></a>

### Вкладки примеров кода

**Обязательная структура:**
```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="lang">
<TabItem value="cli" label="CLI" default>

```bash
nats pub hello "Hello NATS!"
```

</TabItem>
<TabItem value="js" label="JavaScript/TypeScript">

```javascript
await nc.publish("hello", "Hello NATS!");
```

</TabItem>
</Tabs>
```

**Правила:**
1. Вкладка CLI ОБЯЗАТЕЛЬНО идёт первой и имеет атрибут `default`.
2. ОБЯЗАТЕЛЬНО используйте `groupId="lang"` для синхронизации вкладок.
3. Для блоков CLI ОБЯЗАТЕЛЬНО указывайте язык `bash`, а не sh/shell/zsh.
4. ОБЯЗАТЕЛЬНО импортируйте компоненты Tabs в начале MDX-файла.
5. ОБЯЗАТЕЛЬНО соблюдайте порядок языков: CLI, JavaScript/TypeScript, Go, Python, Java, Rust, C#/.NET.

<a id="code-example-workflow"></a>

### Работа с примерами кода

**Для почти всех фрагментов кода ОБЯЗАТЕЛЬНО используйте теги `nats-example`:**
```mdx
<div class="nats-example" data-type="basics-publish" data-languages="cli,js,go,python,java,rust,csharp"></div>
```

**Встроенные `<Tabs groupId="lang">` разрешены только в следующих случаях:**
- Фрагмент относится только к конкретному языку, например API, доступному исключительно в nats.js.
- Фрагмент относится только к bash, например команды настройки сервера.
- Пример настолько прост, что отдельные записи в репозиториях клиентов не оправданы.

Во всех остальных случаях используйте теги `nats-example` и добавляйте примеры в систему нескольких репозиториев.

**Добавление примеров:**

1. **CLI:** создайте файл `static/examples/snippets/cli/[page]/[snippet].sh` в этом репозитории.
   - Имя примера выводится из пути: `cli/basics/publish.sh` → `basics-publish`.
   - **ВАЖНО:** примеры CLI должны быть добавлены в коммит git.
   - Используйте `git add static/examples/snippets/cli/[page]/[snippet].sh`.
   - Подробности — в `static/examples/snippets/cli/README.md`.

2. **Go:** создайте файл `examples/docs/[page]-[snippet]/main.go` в локальном клоне `nats.go`, например `../nats.go-docs`, в ветке doc-examples.
   - Создайте коммит и отправьте его в ветку doc-examples репозитория nats-io/nats.go.
   - **ВАЖНО:** добавьте запись в `EXAMPLES_CONFIG` файла `scripts/fetch-examples.js`:
     ```javascript
     "queue-groups-basic": "examples/docs/queue-groups-basic/main.go"
     ```
   - Пример загружается при сборке командой `npm run fetch-examples`.

3. **Rust:** создайте файл `async-nats/examples/docs_[page]_[snippet].rs` в локальном клоне `nats.rs`, например `../nats.rs-docs`, в ветке doc-examples.
   - Создайте коммит и отправьте его в ветку doc-examples репозитория nats-io/nats.rs.
   - **ВАЖНО:** добавьте запись в `EXAMPLES_CONFIG` файла `scripts/fetch-examples.js`:
     ```javascript
     "queue-groups-basic": "async-nats/examples/docs_queue_groups_basic.rs"
     ```
   - Пример загружается при сборке командой `npm run fetch-examples`.

4. **Загрузка и метаданные:** выполните `npm run fetch-examples`, чтобы:
   - Загрузить примеры Go/Rust с GitHub по записям EXAMPLES_CONFIG
   - Автоматически найти примеры CLI по структуре каталогов
   - Создать `metadata.json` со сведениями обо всех примерах

**Необязательные маркеры** для исключения подготовительного кода:
```go
// NATS-DOC-START
nc.Publish("subject", []byte("hello"))
// NATS-DOC-END
```

<a id="links-between-pages"></a>

### Ссылки между страницами

**На страницу в том же каталоге документации ОБЯЗАТЕЛЬНО ссылайтесь по пути файла с расширением:**
```md
[Watching](./watching.md)
[Subjects](../subjects.md)
[Stream API](./stream/index.md)
```

**НИКОГДА не используйте относительный URL вида `./watching` или `watching`.** Браузер разрешает его относительно текущего адреса, поэтому ссылка ломается при изменении завершающего слеша: `./watching` на странице `/learn/key-value` ведёт к `/learn/watching`. Docusaurus разрешает путь к файлу при сборке, поэтому такая ссылка работает с обоими вариантами адреса.

Для страницы из другого раздела документации, например при переходе из `learn/` в справочник, используйте абсолютный URL вида `/reference/jetstream/api/stream/create`.

<a id="should-rules-best-practices"></a>

## 🟡 Рекомендуемые правила

<a id="code-examples"></a>

### Примеры кода
- По возможности включайте три языка или больше; минимальный набор: CLI, JS, Go.
- Сосредоточьте пример на одной задаче и укладывайтесь в 20 строк.
- Показывайте полный исполняемый код.
- Комментируйте сложные операции.
- При необходимости показывайте ожидаемый вывод.
- Используйте реалистичные имена вместо foo/bar.
- Включайте ошибки, ТОЛЬКО если они помогают объяснить понятие.

**Дерево решений:**
```
Basic operation (pub/sub/request)? → CLI, JS, Go minimum
Language-specific feature? → Only relevant languages
General feature? → All available languages
```

<a id="writing-style"></a>

### Стиль изложения

Пишите просто и прямо. Объясните сложное обычными словами и остановитесь. Основной источник правил — внутреннее руководство Synadia Content Style Guide, которого нет в этом репозитории; его правила приведены ниже и в рабочих процессах написания текстов. Его голос «Sage» означает объяснять сложное простым языком по правилам Оруэлла.

- Используйте активный залог, настоящее время и обращение к читателю; в английском тексте допустимы сокращённые формы.
- Излагайте каждый факт один раз и прямо, без вступительных подводок и игры в персонажа.
- Предпочитайте обычные слова жаргону; одна техническая мысль на предложение; определяйте термин до его использования.
- Заголовки должны быть простыми и описательными; заголовки страниц H1 должны содержать глагол действия (стр. 20).
- Повышайте сложность постепенно, от простого к продвинутому; за исчерпывающими подробностями направляйте в справочник.

**Строго запрещённые стилистические приёмы ИИ:**
- Риторическое противопоставление «X — это не Y, а Z» или «Это не означает…». Допустимо только тогда, когда само противопоставление является технической сутью, и выражено одним простым предложением.
- Расхожие метафоры, сравнения и олицетворения, например «хирургическая операция» или «крик в пустоту».
- Ритмические тройки, драматичные отдельные фразы, образные или игривые заголовки.
- Слова-паразиты и рекламные формулы: «важно отметить», «просто», «мощный», «задействовать потенциал», «бесшовный».
- Избыток жирного выделения: выделяйте термин один раз, при определении.

<a id="interactive-animations"></a>

### Интерактивные анимации

**Используйте NatsFlow для:**
- Схем обмена сообщениями: pub/sub, request/reply
- Временных диаграмм и последовательностей
- Рассылки и балансировки нагрузки
- Операций JetStream

**Не используйте NatsFlow для:**
- Синтаксиса API — показывайте примеры кода
- Конфигурации — используйте блоки кода
- Статической архитектуры — используйте диаграммы

**Использование:**
```mdx
import { NatsFlow, publishSubscribeScenario } from '@site/src/components/NatsFlow';

<NatsFlow scenario={publishSubscribeScenario} />
```

Доступные сценарии: `publishSubscribeScenario`, `requestReplyScenario`, `fanOutScenario`, `queueGroupScenario`.

<a id="may-rules-optional"></a>

## 🟢 Необязательные возможности

- Примеры на дополнительных языках сверх основного набора
- Режим отладки: `<NatsFlow scenario={x} debug={true} />`
- Разделы «Внутреннее устройство», объясняющие механизмы
- Примечания для конкретных языков в раскрываемых разделах
- Ошибочные ситуации, если они помогают обучению
- Ссылки на связанные понятия
- Разделы устранения неполадок

<a id="never-rules"></a>

## ⛔ Запреты

- Создавать документацию без проверки примеров
- Заменять код изображениями: код должен допускать копирование
- Пропускать подпись языка в TabItem
- Использовать относительные импорты вместо псевдонима `@site/`
- Вводить сложные понятия раньше основ
- Описывать каждый параметр вместо ссылки на справочник

---

<a id="technical-reference"></a>

## Техническая справка

<a id="code-examples-system"></a>

### Система примеров кода

**Как это работает:**
1. `scripts/fetch-examples.js` загружает файлы из репозиториев GitHub (nats.go, nats.rs).
2. Извлекает фрагменты по маркерам `NATS-DOC-START/END`.
3. Распределяет их по страницам и фрагментам.
4. Создаёт metadata.json.

**Результат:** `static/examples/snippets/` (исключён из git, создаётся заново при сборке).

<a id="natsflow-props"></a>

### Свойства NatsFlow
```typescript
interface NatsFlowProps {
  scenario: Scenario;              // Обязательно
  customButtons?: ControlButton[]; // Необязательно
  width?: number;                  // По умолчанию: 800
  height?: number;                 // По умолчанию: 400
  showDefaultControls?: boolean;   // По умолчанию: true
  debug?: boolean;                 // По умолчанию: false
}
```

Создание собственных сценариев описано в `src/components/NatsFlow/README.md`.

<a id="common-commands"></a>

### Часто используемые команды
```bash
npm start              # Сервер разработки (localhost:3000)
npm run build          # Собрать сайт
npm run typecheck      # Проверка типов
npm run fetch-examples # Загрузить примеры кода
```

<a id="architecture"></a>

### Архитектура
- **docs/**: страницы документации Markdown/MDX, доступные от корня `/`
- **src/components/**: компоненты React; используйте импорты `@site/`
- **static/**: статические ресурсы
- **docusaurus.config.ts**: конфигурация сайта

<a id="brand-colors"></a>

### Фирменные цвета
- Основной голубой: `#27AAE1`
- Тёмно-синий: `#375C93`
- Зелёный: `#34A574`
- Лаймовый: `#8DC63F`

---

<a id="pre-commit-validation"></a>

## Проверка перед коммитом

**Техническая проверка:**
- [ ] CLI — вкладка по умолчанию, используется `groupId="lang"`
- [ ] Tabs импортированы в начале MDX
- [ ] Для блоков кода указан язык
- [ ] Примеры проверены и работают
- [ ] Ссылки корректны
- [ ] Ссылки на страницы используют пути файлов (`./page.md`), а не относительные URL (`./page`)
- [ ] `npm run typecheck` проходит

**Содержание:**
- [ ] Простой прямой тон без стилистических штампов ИИ: риторических противопоставлений, троек, метафор, драматичных обрывков и образных заголовков
- [ ] Реалистичные имена в примерах
- [ ] Ожидаемый вывод показан, где полезен
- [ ] Сложность растёт постепенно
- [ ] Ошибки показаны только ради объяснения

---

<a id="formatting-standards"></a>

## Правила форматирования

**Go:** `go fmt`
**Rust:** `cargo +nightly fmt`
**GitHub CLI:** `gh pr view <number>` / `gh issue view <number>`

---



<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:6cd5cc61 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->
