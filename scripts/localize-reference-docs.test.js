const assert = require("node:assert/strict");
const { test } = require("node:test");
const { localizeReferenceMarkdown } = require("./localize-reference-docs");

test("generated tables keep code, escaped pipes and unknown fields intact", async () => {
  const source = [
    "# Configuration", "", "## Types", "",
    "| Type | Description | Choices |",
    "| --- | --- | --- |",
    "| `string` | Host for client connections. | `a\\|b` |",
    "| `unknown` | Future description with a \\| pipe | `Description` |",
    "", "```text", "# Configuration", "Description", "```", "",
  ].join("\n");
  const result = await localizeReferenceMarkdown(source);
  assert.match(result, /# Конфигурация \{#configuration\}/);
  assert.match(result, /## Типы \{#types\}/);
  assert.ok(result.includes("| `string` | Хост для клиентских соединений. | `a\\|b` |"));
  assert.ok(result.includes("| `unknown` | Future description with a \\| pipe | `Description` |"));
  assert.ok(result.includes("```text\n# Configuration\nDescription\n```"));
  assert.equal(await localizeReferenceMarkdown(result), result);
});

test("wrapped generated prose translates without changing metadata components", async () => {
  const metadata = '<Reloadable state="reloadable" note="New connections only." />';
  const source = "# host\n\n" + metadata + "\nHost for client\nconnections.\n";
  const result = await localizeReferenceMarkdown(source);
  assert.ok(result.includes(metadata));
  assert.ok(result.includes("Хост для клиентских соединений."));
  assert.equal(await localizeReferenceMarkdown(result), result);
  const section = await localizeReferenceMarkdown("### Outgoing Connections {#outgoing-connections}\nUntranslated future paragraph.\n");
  assert.ok(section.includes("### Исходящие соединения {#outgoing-connections}"));
  assert.ok(section.includes("Untranslated future paragraph."));
});

test("front matter, explicit anchors and error placeholders survive generation", async () => {
  const source = [
    "---", "title: System Errors", "sidebar_label: Errors", "id: errors", "---", "",
    "# System Errors {#stable-anchor}", "", "| Error | Description |", "| --- | --- |",
    "| `JSInvalidJSONErr` | invalid JSON: `{err}` |", "",
    "- Headers are case-sensitive", "",
  ].join("\n");
  const result = await localizeReferenceMarkdown(source);
  assert.ok(result.includes('title: "Системные ошибки"'));
  assert.ok(result.includes('sidebar_label: "Ошибки"'));
  assert.ok(result.includes("id: errors"));
  assert.ok(result.includes("# Системные ошибки {#stable-anchor}"));
  assert.ok(result.includes("| `JSInvalidJSONErr` | недопустимый JSON: `{err}` |"));
  assert.ok(result.includes("- Имена заголовков чувствительны к регистру"));
  assert.equal(await localizeReferenceMarkdown(result), result);
});
