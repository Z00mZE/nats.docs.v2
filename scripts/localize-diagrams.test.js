const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const vm = require('node:vm');
const {test} = require('node:test');
const ts = require('typescript');
const file = path.resolve(__dirname, '../src/i18n/diagrams.ts');
const api = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, esModuleInterop: true},
}).outputText, {exports: api, require: createRequire(file)});
const messages = require('../i18n/ru/diagram-messages.json');

test('every reviewed caption and dynamic template translates with its values intact', () => {
  for (const [source, target] of Object.entries(messages)) {
    const substitute = text => text.replace(/\$\{(\d+)\}/g, (_, index) => `value_${index}`);
    assert.equal(api.localizeDiagramText(substitute(source)), substitute(target), source);
    assert.deepEqual((source.match(/\$\{\d+\}/g) || []).sort(), (target.match(/\$\{\d+\}/g) || []).sort());
  }
});

test('display formatting and technical values survive localization', () => {
  assert.equal(api.localizeDiagramText('  Client  '), '  Клиент  ');
  assert.equal(api.localizeDiagramText('Read 2/10 · sequence 7 answered by n1-east.'), 'Чтение 2/10 · номер 7 получен от n1-east.');
  assert.equal(api.localizeDiagramText('Stored on customer   A. Both consumers want it.'), 'Сохранено в customer   A. Оба потребителя ждут это сообщение.');
  for (const value of ['orders.created', '$SRV.INFO.OrderInventory', '_INBOX.<nuid>', 'constructor', 'Future untranslated caption']) {
    assert.equal(api.localizeDiagramText(value), value);
  }
});

test('rendering helpers leave non-text React children untouched', () => {
  const child = {type: 'span', props: {children: 'test'}};
  for (const value of [null, undefined, false, 0, 7, child, [child]]) assert.equal(api.localizeDiagramContent(value), value);
  assert.equal(api.localizeDiagramContent('Publisher'), 'Издатель');
});

test('all diagram titles and text alternatives have reviewed translations', () => {
  const source = ts.createSourceFile('rehype-nats-flow.mjs', fs.readFileSync(path.join(__dirname, 'rehype-nats-flow.mjs'), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let count = 0;
  const visit = node => {
    if (ts.isVariableDeclaration(node) && ['FALLBACKS', 'TITLES'].includes(node.name.getText(source))) {
      for (const property of node.initializer.properties) {
        const key = property.initializer.text.replace(/\s+/g, ' ').trim();
        assert.ok(Object.hasOwn(messages, key), property.name.getText(source));
        assert.match(messages[key], /[А-Яа-яЁё]/);
        count++;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.ok(count > 170);
});

test('Markdown diagram alternatives show Russian prose and preserve wire subjects', async () => {
  const {default: plugin} = await import('./rehype-nats-flow.mjs');
  const text = node => node.value ?? (node.children ?? []).map(text).join('');
  for (const [scenario, expected] of [['publishSubscribe', 'публикация и подписка'], ['kvWatchAnimated', 'снимок'], ['mqttBridgeAnimated', 'MQTT']]) {
    const tree = {type: 'root', children: [{type: 'element', tagName: 'div', properties: {className: ['nats-flow'], dataScenario: scenario}, children: []}]};
    plugin()(tree);
    const result = text(tree);
    assert.ok(result.startsWith('Движение сообщений — '));
    assert.ok(result.toLowerCase().includes(expected.toLowerCase()), result);
    if (scenario === 'publishSubscribe') assert.ok(result.includes('events.data'));
    if (scenario === 'kvWatchAnimated') assert.ok(result.includes('KV_INVENTORY'));
  }
});
