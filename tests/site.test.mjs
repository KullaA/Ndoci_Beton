import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { translations } from '../src/translations.js';
import { company, media, navigation, services, equipment } from '../src/config.js';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
function keys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, item]) => typeof item === 'object' ? keys(item, prefix + key + '.') : [prefix + key]);
}
test('Both languages have every translation, with no empty values', () => {
  assert.deepEqual(keys(translations.sq).sort(), keys(translations.en).sort());
  for (const lang of ['sq', 'en']) {
    for (const match of html.matchAll(/data-(?:i18n|label)="([^"]+)"/g)) assert.equal(typeof translations[lang][match[1]], 'string', match[1]);
    for (const id of navigation) assert.ok(translations[lang].nav[id]);
    for (const item of services) assert.ok(translations[lang].service[item.id].text);
    for (const item of equipment) assert.ok(translations[lang].equipment[item.id].text);
  }
});
test('Albanian is the initial document language and all anchors exist', () => {
  assert.match(html, /<html lang="sq">/);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`));
  for (const id of navigation) assert.ok(html.includes(`id="${id}"`));
});
test('Confirmed contacts and hidden optional channels remain accurate', () => {
  assert.equal(company.telephone, 'tel:+355695222313');
  assert.equal(company.maps, 'https://maps.app.goo.gl/sMB5jBVtCHbecjt58');
  assert.equal(company.email, null);
  assert.equal(company.whatsapp, null);
  assert.doesNotMatch(html, /<video|<form|TBD|coming soon/i);
});
test('Configured video and optional poster are available locally', async () => {
  for (const path of [media.videoSrc, media.poster]) {
    if (path) await access(new URL('../' + path, import.meta.url));
  }
});
test('All authored local script, stylesheet and image references exist', async () => {
  for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) await access(new URL('../' + match[1], import.meta.url));
});
