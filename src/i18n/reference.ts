import descriptions from '../../i18n/ru/schema-descriptions.json';
import configMessages from '../../i18n/ru/config-messages.json';

const messages: Record<string, string> = descriptions;

// Preserve schema property names, enum values and examples; translate only display text.
export function localizeSchemaText(text: string | undefined): string | undefined {
  return text === undefined ? undefined : Object.hasOwn(messages, text) ? messages[text] : text;
}

// React decodes attribute entities before passing generated notes to a component.
const configText: Record<string, string> = Object.fromEntries(
  Object.entries(configMessages).map(([source, target]) => [
    source.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(),
    target.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
  ]),
);

export function localizeConfigText(text: string): string {
  const key = text.replace(/\s+/g, ' ').trim();
  return Object.hasOwn(configText, key) ? configText[key] : text;
}
