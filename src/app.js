import { company, media, navigation, equipment, services } from './config.js';
import { translations } from './translations.js';
import { icon, createMedia } from './components.js';

const nav = document.querySelector('#main-nav');
const toggle = document.querySelector('.menu-toggle');
let lang = 'sq';
try { if (localStorage.getItem('ndoci-language') === 'en') lang = 'en'; } catch { /* Storage may be disabled. */ }
let menuOpen = false;
createMedia(document.querySelector('.hero-grid'), media);

function setMenu(open, restoreFocus = false) {
  menuOpen = open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', translations[lang][open ? 'closeMenu' : 'openMenu']);
  nav.classList.toggle('is-open', open);
  if (restoreFocus) toggle.focus();
}
toggle.addEventListener('click', () => setMenu(!menuOpen));
nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false, true); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuOpen) setMenu(false, true);
});
document.addEventListener('click', (event) => {
  if (menuOpen && !event.target.closest('.header')) setMenu(false);
});
document.querySelector('.header').addEventListener('focusout', () => {
  setTimeout(() => { if (menuOpen && !document.querySelector('.header').contains(document.activeElement)) setMenu(false); }, 0);
});
window.matchMedia('(min-width: 1101px)').addEventListener('change', () => setMenu(false));

function renderLanguage() {
  const t = translations[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelector('meta[name="description"]').content = t.description;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t[el.dataset.i18n].replaceAll('{since}', company.operatingSince).replaceAll('{projects}', company.completedProjects);
  });
  document.querySelectorAll('[data-company]').forEach(el => { el.textContent = company[el.dataset.company]; });
  document.querySelectorAll('[data-label]').forEach(el => { el.setAttribute('aria-label', t[el.dataset.label]); });
  document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.lang === lang)));
  const navMarkup = navigation.map(id => `<a href="#${id}">${t.nav[id]}</a>`).join('');
  nav.innerHTML = navMarkup;
  document.querySelector('#footer-nav').innerHTML = navMarkup;
  document.querySelector('#services-grid').innerHTML = services.map((item, index) => `<article class="service-card"><div class="card-top">${icon(item.icon)}<span>0${index + 1}</span></div><h3>${t.service[item.id].title}</h3><p>${t.service[item.id].text}</p><a href="#contact" aria-label="${t.serviceCta}: ${t.service[item.id].title}"><span>${t.serviceCta}</span><span aria-hidden="true">↗</span></a></article>`).join('');
  document.querySelector('#equipment-list').innerHTML = equipment.map(item => `<article class="equipment-row"><span class="equipment-number">${item.number}</span>${icon(item.icon)}<div><h3>${t.equipment[item.id].title}</h3><p>${t.equipment[item.id].text}</p></div></article>`).join('');
  const optional = document.querySelector('#optional-contact');
  optional.replaceChildren();
  for (const [enabled, href, label] of [[company.email, `mailto:${company.email}`, t.email], [company.whatsapp, company.whatsapp, t.whatsapp]]) {
    if (!enabled) continue;
    const link = document.createElement('a');
    link.className = 'map-link';
    link.href = href;
    link.textContent = label + ' ↗';
    optional.append(link);
  }
  setMenu(menuOpen);
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
  // Retain the visible section's viewport position even when translated text reflows.
  const sections = [...document.querySelectorAll('main > section')];
  const anchor = sections.find(section => section.getBoundingClientRect().bottom > 120);
  const top = anchor?.getBoundingClientRect().top;
  lang = button.dataset.lang;
  try { localStorage.setItem('ndoci-language', lang); } catch { /* Selection still works in memory. */ }
  renderLanguage();
  if (anchor) window.scrollBy({ top: anchor.getBoundingClientRect().top - top, behavior: 'instant' });
}));
document.querySelectorAll('[data-phone]').forEach(link => {
  link.href = company.telephone;
  if (!link.children.length) link.textContent = company.phone;
});
document.querySelectorAll('[data-maps]').forEach(link => { link.href = company.maps; });
document.querySelector('#year').textContent = new Date().getFullYear();
renderLanguage();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => { el.classList.add('reveal-pending'); observer.observe(el); });
}
