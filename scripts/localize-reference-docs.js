#!/usr/bin/env node
// Apply reviewed translations after reference generation; leave unknown text intact.
const fs = require("node:fs");
const path = require("node:path");
const { createSlugger } = require("@docusaurus/utils/lib/slugger.js");

const ROOT = path.resolve(__dirname, "..");
const messages = {
  ...require("../i18n/ru/config-messages.json"),
  ...require("../i18n/ru/error-header-messages.json"),
  ...require("../i18n/ru/reference-messages.json"),
};
const normalizeKey = (text) => text.replace(/[ \t]+$/gm, "");
const normalizedMessages = Object.fromEntries(Object.entries(messages).map(([source, target]) => [normalizeKey(source), target]));
const canonicalKey = (text) => text.replace(/\s+/g, " ").trim();
const canonicalMessages = Object.fromEntries(Object.entries(messages).map(([source, target]) => [canonicalKey(source), target]));
const translate = (text) => Object.hasOwn(messages, text) ? messages[text] : Object.hasOwn(normalizedMessages, normalizeKey(text)) ? normalizedMessages[normalizeKey(text)] : Object.hasOwn(canonicalMessages, canonicalKey(text)) ? canonicalMessages[canonicalKey(text)] : text;
const translateLine = (line) => {
  const result = translate(line);
  if (result !== line) return result;
  if (/^#{1,6}\s/.test(line)) {
    const plain = line.replace(/\s+\{#[^}]+\}\s*$/, "");
    const heading = translate(plain);
    if (heading !== plain) return heading;
  }
  const item = line.match(/^(\s*(?:[-+*]|\d+\.)\s+)(.+)$/);
  return item ? item[1] + translate(item[2]) : line;
};

async function localizeReferenceMarkdown(source) {
  const { unified } = await import("unified");
  const { default: remarkParse } = await import("remark-parse");
  const { default: remarkGfm } = await import("remark-gfm");
  const { toString } = await import("mdast-util-to-string");
  const normalized = source.replace(/\r\n/g, "\n");
  const front = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  let header = front?.[0] ?? "";
  let body = normalized.slice(header.length);
  const slugger = createSlugger();
  const ids = [];
  const visit = (node) => {
    if (node.type === "heading") {
      const text = toString(node);
      ids.push(text.match(/\{#([^}]+)\}\s*$/)?.[1] ?? slugger.slug(text));
    }
    node.children?.forEach(visit);
  };
  const processor = unified().use(remarkParse).use(remarkGfm);
  const tree = processor.parse(body);
  visit(tree);
  // Translate complete cells rather than splitting on pipes: GFM allows escaped
  // pipes and inline code in table cells. Keep their surrounding delimiters.
  const edits = [];
  const translateNodes = (node) => {
    if (node.type === "tableCell") {
      const start = node.position.start.offset;
      const end = node.position.end.offset;
      const raw = body.slice(start, end);
      const [, prefix, text, suffix] = raw.match(/^(\|?\s*)([\s\S]*?)(\s*\|?)$/);
      const result = translate(text);
      if (result !== text) edits.push({start, end, text: prefix + result.replace(/\n/g, " ") + suffix});
      return;
    }
    node.children?.forEach(translateNodes);
  };
  translateNodes(tree);
  for (const edit of edits.sort((a, b) => b.start - a.start)) body = body.slice(0, edit.start) + edit.text + body.slice(edit.end);
  if (front) {
    header = header.replace(/^(title|description|sidebar_label):\s*(.+)$/gm, (line, key, value) => {
      const text = value.startsWith('"') ? JSON.parse(value) : value;
      const result = translate(text);
      return result === text ? line : `${key}: ${JSON.stringify(result)}`;
    });
  }
  const lines = body.split("\n");
  const output = [];
  let fence;
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker || fence) {
      output.push(line);
      if (!fence) fence = marker[1];
      else if (marker?.[1][0] === fence[0] && marker[1].length >= fence.length) fence = undefined;
      i++;
    } else if (!line.trim()) {
      output.push(line);
      i++;
    } else {
      const start = i;
      // Generator metadata components can immediately precede prose without a
      // blank line. Keep their attributes intact and translate the prose alone.
      if (/^<(?:Aliases|Reloadable)\b/.test(line)) { output.push(line); i++; continue; }
      while (i < lines.length && lines[i].trim() && !/^\s*(`{3,}|~{3,})/.test(lines[i]) && !/^<(?:Aliases|Reloadable)\b/.test(lines[i])) i++;
      const block = lines.slice(start, i).join("\n");
      const withoutIds = block.replace(/^(#{1,6} .+?)\s+\{#[^}]+\}\s*$/gm, "$1");
      const result = translate(block);
      const plainResult = translate(withoutIds);
      output.push(result !== block ? result : plainResult !== withoutIds ? plainResult : block.split("\n").map(translateLine).join("\n"));
    }
  }
  let headingIndex = 0;
  fence = undefined;
  const translated = output.join("\n").split("\n").map((line) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = undefined;
    }
    if (!fence && /^#{1,6}\s/.test(line)) {
      const id = ids[headingIndex++];
      const plain = line.replace(/\s*\{#[^}]+\}\s*$/, "");
      // Keep existing anchors and add the original anchor to translated headings.
      if (/\{#[^}]+\}\s*$/.test(line) || /[А-Яа-яЁё]/.test(plain)) return `${plain} {#${id}}`;
    }
    return line;
  }).join("\n");
  if (headingIndex !== ids.length) throw new Error("Translation changed the heading structure");
  return header + translated;
}

async function localizeReferenceTree(directory) {
  let changed = 0;
  const visit = async (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (/\.mdx?$/.test(entry.name)) {
        const source = fs.readFileSync(file, "utf8");
        const translated = await localizeReferenceMarkdown(source);
        if (source.replace(/\r\n/g, "\n") !== translated) {
          fs.writeFileSync(file, translated);
          changed++;
        }
      }
    }
  };
  await visit(directory);
  return changed;
}

module.exports = { localizeReferenceMarkdown, localizeReferenceTree };
if (require.main === module) {
  const directory = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, "reference_versioned_docs");
  localizeReferenceTree(directory).then((count) => console.log(`Localized ${count} reference pages`)).catch((error) => { console.error(error); process.exitCode = 1; });
}
