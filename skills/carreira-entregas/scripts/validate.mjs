#!/usr/bin/env node
// Confere o JSON de entregas contra os limites da Carreira (achievementInputSchema do Portal de Vagas) e procura
// segredos. Sem dependências: roda em qualquer projeto. Uso: node validate.mjs <arquivo.json>

import { readFileSync } from 'node:fs';

const FORMAT = 'portal-vagas/carreira-entregas@1';
const LIMITS = { title: 120, longText: 10_000, result: 300, results: 10, technologies: 30, technologyName: 60, questions: 3 };
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const FIELDS = new Set(['title', 'startMonth', 'endMonth', 'technologies', 'results', 'details', 'internalNotes', 'questions']);
const SECRETS = [
  [/sk-[A-Za-z0-9_-]{16,}/, 'chave de API (sk-...)'],
  [/AKIA[0-9A-Z]{16}/, 'chave de acesso da AWS'],
  [/gh[pousr]_[A-Za-z0-9]{20,}/, 'token do GitHub'],
  [/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./, 'JWT'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'chave privada'],
  [/[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]+@/i, 'URL com usuário e senha'],
  [/\b(api[_-]?key|secret|password|senha|token|bearer)\b\s*[:=]\s*["']?[A-Za-z0-9_\-./+]{8,}/i, 'atribuição de segredo'],
];

const file = process.argv[2];
if (!file) {
  console.error('Uso: node validate.mjs <arquivo.json>');
  process.exit(2);
}

let data;
try {
  data = JSON.parse(readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`JSON inválido: ${error.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];
const isText = (value) => typeof value === 'string';
const optionalText = (value) => value === null || value === undefined || isText(value);

if (data?.format !== FORMAT) errors.push(`"format" deve ser "${FORMAT}"`);
if (!Array.isArray(data?.achievements) || data.achievements.length === 0) {
  errors.push('"achievements" deve ser uma lista com pelo menos uma entrega');
}

for (const [index, item] of (Array.isArray(data?.achievements) ? data.achievements : []).entries()) {
  const at = `entrega ${index + 1}${isText(item?.title) && item.title.trim() ? ` ("${item.title.trim()}")` : ''}`;
  if (!item || typeof item !== 'object') {
    errors.push(`${at}: não é um objeto`);
    continue;
  }
  for (const key of Object.keys(item)) if (!FIELDS.has(key)) warnings.push(`${at}: campo desconhecido "${key}" será ignorado`);

  if (!isText(item.title) || !item.title.trim()) errors.push(`${at}: título obrigatório`);
  else if (item.title.trim().length > LIMITS.title) errors.push(`${at}: título passa de ${LIMITS.title} caracteres`);

  for (const key of ['startMonth', 'endMonth']) {
    const value = item[key];
    if (value !== null && value !== undefined && !(isText(value) && MONTH.test(value))) {
      errors.push(`${at}: ${key} deve ser "AAAA-MM" ou null`);
    }
  }
  if (isText(item.startMonth) && isText(item.endMonth) && item.endMonth < item.startMonth) {
    errors.push(`${at}: o fim vem antes do início`);
  }

  const technologies = item.technologies ?? [];
  if (!Array.isArray(technologies)) errors.push(`${at}: technologies deve ser uma lista`);
  else {
    if (technologies.length > LIMITS.technologies) errors.push(`${at}: mais de ${LIMITS.technologies} tecnologias`);
    const seen = new Set();
    for (const name of technologies) {
      if (!isText(name) || !name.trim()) errors.push(`${at}: tecnologia vazia`);
      else if (name.trim().length > LIMITS.technologyName) errors.push(`${at}: "${name}" passa de ${LIMITS.technologyName} caracteres`);
      else if (seen.has(name.trim().toLowerCase())) warnings.push(`${at}: "${name}" repetida`);
      else seen.add(name.trim().toLowerCase());
    }
  }

  const results = item.results ?? [];
  if (!Array.isArray(results)) errors.push(`${at}: results deve ser uma lista`);
  else {
    if (results.length > LIMITS.results) errors.push(`${at}: mais de ${LIMITS.results} resultados`);
    for (const result of results) {
      if (!isText(result) || !result.trim()) errors.push(`${at}: resultado vazio`);
      else if (result.length > LIMITS.result) errors.push(`${at}: resultado passa de ${LIMITS.result} caracteres: "${result.slice(0, 40)}…"`);
    }
    // A Carreira só chama de completa a entrega com tecnologias, detalhes e um resultado com número.
    if (!results.some((result) => isText(result) && /\d/.test(result))) {
      warnings.push(`${at}: nenhum resultado com número; a entrega vai aparecer como incompleta`);
    }
  }

  for (const key of ['details', 'internalNotes']) {
    if (!optionalText(item[key])) errors.push(`${at}: ${key} deve ser texto ou null`);
    else if (isText(item[key]) && item[key].length > LIMITS.longText) errors.push(`${at}: ${key} passa de ${LIMITS.longText} caracteres`);
  }
  if (!isText(item.details) || !item.details.trim()) warnings.push(`${at}: sem detalhes`);
  if (!Array.isArray(technologies) || technologies.length === 0) warnings.push(`${at}: sem tecnologias`);

  const questions = item.questions ?? [];
  if (!Array.isArray(questions) || questions.some((question) => !isText(question))) {
    errors.push(`${at}: questions deve ser uma lista de textos`);
  } else if (questions.length > LIMITS.questions) {
    errors.push(`${at}: mais de ${LIMITS.questions} perguntas`);
  }

  const everything = JSON.stringify(item);
  for (const [pattern, label] of SECRETS) {
    if (pattern.test(everything)) errors.push(`${at}: parece conter ${label}; tire antes de usar`);
  }
}

for (const warning of warnings) console.log(`aviso: ${warning}`);
for (const error of errors) console.error(`erro: ${error}`);
const count = Array.isArray(data?.achievements) ? data.achievements.length : 0;
if (errors.length > 0) {
  console.error(`${errors.length} erro(s) em ${count} entrega(s).`);
  process.exit(1);
}
console.log(`OK: ${count} entrega(s) dentro dos limites da Carreira${warnings.length ? `, ${warnings.length} aviso(s)` : ''}.`);
