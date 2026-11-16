#!/usr/bin/env node
// Keep generated reference navigation in Russian and its translation keys unique.
const fs = require("node:fs");
const path = require("node:path");

const labels = {
  Reference: "Справочник",
  "Release Notes": "Выпуски",
  Configuration: "Конфигурация",
  Account: "Учётная запись",
  Stream: "Поток",
  Consumer: "Потребитель",
  Meta: "Метаданные",
  Headers: "Заголовки",
  Advisories: "Уведомления",
  Advisory: "Уведомления",
  Metric: "Метрики",
  Errors: "Ошибки",
  "Cross-account subjects": "Темы между учётными записями",
  System: "Система",
  Monitoring: "Мониторинг",
  Services: "Сервисы",
  Protocols: "Протоколы",
};

function localizeReferenceSidebar(items, parentKey = "reference") {
  return items.map((item, index) => {
    if (typeof item === "string") return item;
    const key = item.key ?? item.link?.id ?? item.id ?? item.href ?? `${parentKey}/${index}`;
    return {
      ...item,
      ...(item.label && { label: labels[item.label] ?? item.label }),
      key,
      ...(item.items && { items: localizeReferenceSidebar(item.items, key) }),
    };
  });
}

module.exports = { localizeReferenceSidebar };

if (require.main === module) {
  const dir = path.join(__dirname, "../reference_versioned_sidebars");
  for (const name of fs.readdirSync(dir).filter((n) => /^version-.+-sidebars\.json$/.test(n))) {
    const file = path.join(dir, name);
    const sidebar = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const key of Object.keys(sidebar)) {
      sidebar[key] = localizeReferenceSidebar(sidebar[key]);
    }
    fs.writeFileSync(file, JSON.stringify(sidebar, null, 2) + "\n");
    console.log(`Localized ${name}`);
  }
}
