<a id="cli-examples"></a>

# Примеры CLI

Этот каталог содержит примеры CLI для документации NATS. Эти примеры **хранятся в git**, а примеры Go/Rust загружаются с GitHub во время сборки.

<a id="directory-structure"></a>

## Структура каталогов

Путь к примеру имеет формат `[page]/[snippet].sh`.

Примеры:
- `queue-groups/basic.sh` → фрагмент `basic` на странице `queue-groups`
- `request-reply/timeout.sh` → фрагмент `timeout` на странице `request-reply`

<a id="adding-new-cli-examples"></a>

## Добавление примеров CLI

1. **Создайте файл примера:**
   ```bash
   # Создайте файл в соответствующем каталоге
   static/examples/snippets/cli/[page]/[snippet].sh
   ```

2. **Напишите команды CLI:**
   ```bash
   #!/bin/bash

   # Здесь находятся ваши команды NATS CLI
   nats pub subject "message"
   ```

3. **Добавьте файл в git (ВАЖНО!):**
   ```bash
   # Примеры CLI ОБЯЗАТЕЛЬНО добавляются в git
   git add static/examples/snippets/cli/[page]/[snippet].sh
   ```

4. **Используйте пример в документации:**
   ```mdx
   <div class="nats-example" data-type="[page]-[snippet]" data-languages="cli,js,go,python,java,rust,csharp"></div>
   ```

<a id="why-cli-examples-are-different"></a>

## Особенности примеров CLI

- **Все остальные языки** (Go, Rust, JavaScript, Python, Java, C# и другие): примеры хранятся в репозиториях клиентов и загружаются при сборке.
- **Примеры CLI:** хранятся непосредственно в этом репозитории и добавляются в git.
- **Причина:** это простые скрипты оболочки, которым не нужны отдельные репозитории.
- **gitignore:** правило `static/examples/snippets/*` исключает все языки, а исключение `!static/examples/snippets/cli/` сохраняет отслеживание CLI.

<a id="example-workflow"></a>

## Пример рабочего процесса

```bash
# 1. Создайте пример CLI
echo '#!/bin/bash
nats pub hello "world"' > static/examples/snippets/cli/basics/hello.sh

# 2. Добавьте файл в git: не пропустите этот шаг
git add static/examples/snippets/cli/basics/hello.sh

# 3. Создайте коммит
git commit -m "Add CLI example for basics-hello"

# 4. Используйте пример в документации
# В файле .md:
# <div class="nats-example" data-type="basics-hello" data-languages="cli"></div>
```

<a id="troubleshooting"></a>

## Устранение неполадок

**Вопрос: пример CLI не отображается на опубликованном сайте.**
Ответ: добавлен ли файл командой `git add`? Примеры CLI должны быть включены в коммит.

**Вопрос: как проверить, отслеживается ли пример CLI?**
Ответ: выполните `git ls-files static/examples/snippets/cli/`, чтобы увидеть все отслеживаемые файлы.

**Вопрос: файл создан, но в git его нет.**
Ответ: родительский каталог `snippets/` включён в `.gitignore` для примеров Go/Rust. Явно добавьте файл CLI командой `git add static/examples/snippets/cli/your-file.sh`.
