<a id="natsflow-component"></a>

# Компонент NatsFlow

Интерактивные диаграммы обмена сообщениями NATS на основе React Flow.

<a id="overview"></a>

## Обзор

NatsFlow позволяет размещать интерактивные анимации обмена сообщениями NATS прямо в файлах Markdown. MDX не требуется.

<a id="usage-in-markdown"></a>

## Использование в Markdown

Добавьте тег `<div>` с классом `nats-flow`:

```html
<div class="nats-flow" data-scenario="publishSubscribe"></div>
```

<a id="available-scenarios"></a>

### Доступные сценарии

Есть два вида сценариев (см. [Добавление сценариев](#adding-new-scenarios)):

- **Анимированные компоненты** — имена `data-scenario` оканчиваются на `Animated`, например `clusterMeshAnimated` и `kvWatchAnimated`. Они составляют большинство из примерно 80 сценариев раздела Learn.
- **Статические сценарии** — фиксированные диаграммы, например `publishSubscribe`, `requestReply`, `queueGroup` и `fanOut`.

Полный актуальный список — экспорты в [`scenarios/index.ts`](./scenarios/index.ts).

```html
<div class="nats-flow" data-scenario="publishSubscribe"></div>
<div class="nats-flow" data-scenario="clusterMeshAnimated" data-width="600" data-height="350"></div>
```

<a id="options"></a>

### Параметры

Настройте диаграмму с помощью атрибутов data:

```html
<!-- Нестандартный размер -->
<div class="nats-flow"
     data-scenario="publishSubscribe"
     data-width="800"
     data-height="500">
</div>

<!-- Скрыть элементы управления -->
<div class="nats-flow"
     data-scenario="requestReply"
     data-show-controls="false">
</div>
```

<a id="available-options"></a>

#### Доступные параметры

- `data-scenario` (обязательный): отображаемый сценарий; полный список — в [`scenarios/index.ts`](./scenarios/index.ts).
- `data-width`: ширина в пикселях, по умолчанию 600.
- `data-height`: высота в пикселях, по умолчанию 400.
- `data-show-controls`: отображение элементов масштабирования и перемещения; по умолчанию **false**. Для включения укажите `data-show-controls="true"`.

<a id="architecture"></a>

## Архитектура

<a id="component-structure"></a>

### Структура компонента

```
NatsFlow/
├── index.tsx              # Основной компонент NatsFlow
├── types.ts               # Определения типов TypeScript
├── README.md              # Этот файл
├── nodes/                 # Пользовательские компоненты узлов
│   ├── BaseNode.tsx       # Базовый узел с оформлением
│   ├── PublisherNode.tsx / SubscriberNode.tsx / ServiceNode.tsx
│   └── ClientNode.tsx / ServerNode.tsx / LabelNode.tsx
├── edges/                 # Пользовательские компоненты связей
│   ├── AnimatedEdge.tsx   # Анимация передачи сообщений
│   └── FloatingEdge.tsx   # Связь с автоматическим выбором точек соединения для сетчатых топологий
├── scenarios/             # Около 100 файлов: статические сценарии .ts и компоненты *Animated.tsx
├── icons/                 # Общие значки SVG
├── hooks/                 # Хуки React (useInterval)
└── lib/                   # Вспомогательные функции
```

<a id="how-it-works"></a>

### Как это работает

1. **Файлы Markdown:** авторы добавляют теги `<div class="nats-flow" data-scenario="...">`.
2. **Плагин Docusaurus** (`src/plugins/nats-flow/`): клиентский модуль динамически импортирует общий модуль NatsFlow, присваивает `window.NatsFlow` базовый компонент, анимированные компоненты с именами PascalCase и вложенное отображение статических сценариев `scenarios`, затем отправляет событие `natsflow-loaded`.
3. **Загрузчик** (`/static/js/nats-flow-loader.js`): находит неинициализированные блоки `.nats-flow` и отображает их. Значение `data-scenario`, оканчивающееся на `Animated`, автоматически преобразуется в имя компонента PascalCase, поэтому для новых сценариев загрузчик менять не нужно. Остальные имена ищутся в отображении `scenarios`. MutationObserver повторяет инициализацию при переходах SPA в Docusaurus.
4. **Текстовая замена при сборке** (`scripts/rehype-nats-flow.mjs`): в выводе Markdown/LLM каждый блок заменяется заголовком, текстовым описанием и списком связей из `description` сценария или записей `FALLBACKS`/`TITLES`. Если описания нет, сборка выводит предупреждение.

Файл `src/types/global.d.ts` по соглашению повторяет структуру `window.NatsFlow`, но проверка типов не обеспечивает их соответствие. Обновляйте его при регистрации сценариев.

<a id="key-features"></a>

### Основные возможности

- Работа в обычных файлах Markdown (`.md`)
- Анимация передачи сообщений
- Интерактивность с необязательным масштабированием и перемещением
- Готовые схемы NATS
- Автоматическая инициализация через MutationObserver, совместимая с навигацией Docusaurus

<a id="adding-new-scenarios"></a>

## Добавление сценариев

Есть два вида сценариев. Для большинства новых диаграмм используются **анимированные** компоненты.

| Вид | Файл | Когда использовать |
|------|------|------|
| **Анимированный компонент** (`.tsx`) | `scenarios/<name>Animated.tsx`, экспортирующий компонент React `XxxAnimated` | Движение, шаги, состояние или переключатели; основной вариант для новых диаграмм |
| **Статический сценарий** (`.ts`) | `scenarios/<name>.ts`, экспортирующий объект `{ description, nodes, edges }` | Фиксированная диаграмма без логики анимации |

> Скопируйте наиболее похожий существующий сценарий. Для обмена с ответом (запрос → ответ, публикация → подтверждение) начните с `requestRetryAnimated.tsx`, а для топологии из нескольких узлов — с `clusterMeshAnimated.tsx`. Оба используют приведённую ниже стандартную структуру.

<a id="animated-component-the-common-case"></a>

### Анимированный компонент (основной вариант)

Загрузчик автоматически сопоставляет любое значение `data-scenario`, оканчивающееся на `Animated`, с компонентом **PascalCase** в `window.NatsFlow`: например, `data-scenario="myFlowAnimated"` обращается к `MyFlowAnimated`. Подключите сценарий в **четырёх** местах. Сам файл компонента не показывает эти подключения, поэтому их легко пропустить:

1. **Создайте** `scenarios/myFlowAnimated.tsx` со следующей структурой:

```tsx
import { ReactFlow, ReactFlowProvider, Background, MarkerType } from '@xyflow/react';
import { PublisherNode, ServerNode } from '../nodes';   // Используйте общие узлы
import { AnimatedEdge } from '../edges';

const nodeTypes = { publisher: PublisherNode, server: ServerNode /* и пользовательские встроенные узлы */ };
const edgeTypes = { animated: AnimatedEdge };

function MyFlowAnimatedInner({ width = 600, height = 320 }) {
  const [stage, setStage] = useState('a');          // Состояние автомата этапов
  useEffect(() => { /* setTimeout для смены этапа и повторения цикла */ }, [stage]);
  const nodes = [ /* Пересоздаются по `stage` при каждом отображении */ ];
  const edges = [ /* Только связи активного этапа; данные AnimatedEdge:
                     { color, label, labelColor, animated, interval } */ ];
  return (<div>{/* Кнопки переключения этапов */}<ReactFlow nodes={nodes} edges={edges}
            nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView .../>{/* Подпись */}</div>);
}

// Всегда оборачивайте в ReactFlowProvider.
export function MyFlowAnimated(props) {
  return <ReactFlowProvider><MyFlowAnimatedInner {...props} /></ReactFlowProvider>;
}
```

2. **Экспортируйте** компонент из `scenarios/index.ts`:

```typescript
export { MyFlowAnimated } from './myFlowAnimated';
```

3. **Зарегистрируйте** компонент в `window.NatsFlow` в `src/plugins/nats-flow/client-module.tsx`: в объекте верхнего уровня, а не во вложенном отображении `scenarios`:

```typescript
MyFlowAnimated: module.MyFlowAnimated,
```

4. **Добавьте текстовую замену** в `scripts/rehype-nats-flow.mjs`: запись `FALLBACKS` для вывода без JavaScript, Markdown и LLM, а также запись `TITLES`. Без них сборка продолжится, но выдаст предупреждение, а вывод Markdown будет содержать общее описание:

```javascript
// FALLBACKS
myFlowAnimated: 'Одно или два предложения о том, что показывает анимация.',
// TITLES
myFlowAnimated: 'Моя схема (анимация)',
```

Затем вставьте сценарий. Обратите внимание на camelCase в атрибуте:

```html
<div class="nats-flow" data-scenario="myFlowAnimated" data-width="600" data-height="320"></div>
```

<a id="static-scenario"></a>

### Статический сценарий

1. Создайте `scenarios/myScenario.ts`, экспортирующий объект `NatsFlowScenario` (`{ description, nodes, edges }`) с той же структурой узлов и связей.
2. Экспортируйте его из `scenarios/index.ts`.
3. Добавьте его в отображение `scenarios: { ... }` внутри `window.NatsFlow` в `src/plugins/nats-flow/client-module.tsx`. Оно используется для значений `data-scenario`, которые не оканчиваются на `Animated`.
4. Вставьте: `<div class="nats-flow" data-scenario="myScenario"></div>`.

> Пользовательские компоненты узлов регистрируются в локальном отображении `nodeTypes` сценария. Составные узлы рисуйте внутри одного компонента либо используйте дочерние узлы с `parentId`. Внутренние механизмы, например репликацию от лидера к последователям, показывайте на посвящённых им страницах, а не во вводных схемах.

<a id="node-types"></a>

## Типы узлов

<a id="publisher-node"></a>

### Узел издателя
- Зелёный индикатор
- Исходящая точка соединения справа
- Используется для издателей сообщений

<a id="subscriber-node"></a>

### Узел подписчика
- Синий индикатор
- Входящая точка соединения слева
- Используется для подписчиков сообщений

<a id="service-node"></a>

### Узел сервиса
- Фиолетовый индикатор
- Входящие точки соединения слева и сверху для запросов
- Исходящие точки соединения справа и снизу для ответов
- Используется для сервисов request-reply

<a id="edge-types"></a>

## Типы связей

<a id="animated-edge"></a>

### Анимированная связь
- Кривые Безье
- Анимированные частицы вдоль пути
- Настраиваемые цвет, размер и подписи
- Для включения анимации укажите `animated: true` в данных связи

<a id="styling"></a>

## Оформление

Для оформления компонент использует классы Tailwind CSS. Анимированные сценарии используют фирменные цвета NATS (см. CLAUDE.md):

- Основной голубой: `#27AAE1`
- Тёмно-синий: `#375C93`
- Зелёный: `#34A574`
- Лаймовый: `#8DC63F`

<a id="development"></a>

## Разработка

<a id="testing-locally"></a>

### Локальная проверка

1. Запустите сервер разработки:
```bash
cd nats.docs.v2
npm start
```

2. Добавьте тестовую диаграмму в любой файл `.md`:
```html
<div class="nats-flow" data-scenario="publishSubscribe"></div>
```

3. Откройте `http://localhost:3000`.

<a id="debugging"></a>

### Отладка

Откройте консоль браузера, чтобы увидеть:
- Состояние загрузки компонента
- Ошибки сценариев
- Проблемы отображения

Добавьте `?debug=true` к любому URL, чтобы включить React DevTools.

<a id="dependencies"></a>

## Зависимости

- `@xyflow/react`: библиотека React Flow
- `react` и `react-dom`: React 19
- `clsx` и `tailwind-merge`: управление служебными CSS-классами

Все зависимости уже включены в основной `package.json` проекта.
