import type { ReactNode } from 'react';
import type { AriaLabelConfig } from '@xyflow/react';
import translations from '../../i18n/ru/diagram-messages.json';

const canonical = (text: string) => text.replace(/\s+/g, ' ').trim();
const messages: Record<string, string> = translations;
const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Match complete display strings. Captured values are kept verbatim: subject
// names, sequence numbers and instance IDs remain the same in every language.
const patterns = Object.entries(messages)
  .filter(([source]) => /\$\{\d+\}/.test(source))
  .sort(([a], [b]) => b.replace(/\$\{\d+\}/g, '').length - a.replace(/\$\{\d+\}/g, '').length)
  .map(([source, target]) => {
    const slots: string[] = [];
    const parts = source.split(/(\$\{\d+\})/g).map((part) => {
      if (!/^\$\{\d+\}$/.test(part)) return escapePattern(part).replace(/ /g, '\\s+');
      slots.push(part);
      return '([\\s\\S]*?)';
    });
    return { pattern: new RegExp(`^${parts.join('')}$`), slots, target };
  });

const cache = new Map<string, string>();

function translate(text: string): string {
  const key = canonical(text);
  if (Object.hasOwn(messages, key)) return messages[key];
  for (const { pattern, slots, target } of patterns) {
    const match = text.trim().match(pattern);
    if (match) {
      const values = Object.fromEntries(slots.map((slot, index) => [slot, match[index + 1]]));
      return target.replace(/\$\{\d+\}/g, (slot) => values[slot]);
    }
  }
  return text;
}

export function localizeDiagramText(text: string): string {
  if (cache.has(text)) return cache.get(text)!;
  const translated = translate(text);
  const result = translated === text ? text : text.match(/^\s*/)![0] + translated + text.match(/\s*$/)![0];
  // Animated counters produce new strings continuously; bound the display cache.
  if (cache.size >= 1000) cache.clear();
  cache.set(text, result);
  return result;
}

export function localizeDiagramContent(content: ReactNode): ReactNode {
  return typeof content === 'string' ? localizeDiagramText(content) : content;
}

export const diagramAriaLabels: AriaLabelConfig = {
  'node.a11yDescription.default': 'Нажмите Enter или пробел, чтобы выбрать узел. Delete удаляет его, Escape отменяет выбор.',
  'node.a11yDescription.keyboardDisabled': 'Нажмите Enter или пробел, чтобы выбрать узел. Стрелки перемещают узел, Delete удаляет его, Escape отменяет выбор.',
  'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) => {
    const directions: Record<string, string> = { left: 'влево', right: 'вправо', up: 'вверх', down: 'вниз' };
    return `Выбранный узел перемещён ${directions[direction] ?? direction}. Новая позиция: x: ${x}, y: ${y}`;
  },
  'edge.a11yDescription.default': 'Нажмите Enter или пробел, чтобы выбрать связь. Delete удаляет её, Escape отменяет выбор.',
  'controls.ariaLabel': 'Управление диаграммой',
  'controls.zoomIn.ariaLabel': 'Увеличить',
  'controls.zoomOut.ariaLabel': 'Уменьшить',
  'controls.fitView.ariaLabel': 'Показать всю диаграмму',
  'controls.interactive.ariaLabel': 'Переключить интерактивность',
  'minimap.ariaLabel': 'Мини-карта',
  'handle.ariaLabel': 'Точка соединения',
};
