const paths = {
  plant: '<path d="M7 38h34M10 38V21h12v17M22 38V16h16v22M13 21V8h6v13M27 22h6m-6 6h6M13 28h5m9-12V7h8v9"/>',
  truck: '<path d="M5 32V17h23v15m0-10h8l7 8v6h-5M5 36h7m8 0h10M10 17l5-7h10l5 7m-13-6 7 6M32 25v5h9"/><circle cx="16" cy="35" r="4"/><circle cx="34" cy="35" r="4"/>',
  pump: '<path d="M6 34h34v-8h-9v8M10 26h13v8M17 26V14l12-8 12 14v7M20 15l9-6 9 12M7 39h5m23 0h6"/><circle cx="15" cy="36" r="3"/><circle cx="32" cy="36" r="3"/>',
  support: '<path d="m10 35 23-23 5 5-23 23-5-5ZM29 16l5 5M8 10h12v9H8zM14 19v12M27 38h14M38 26v12"/>',
};
export function icon(name) {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

// No video element or network request is created until a source is configured.
export function createMedia(container, config) {
  if (!config.videoSrc) return;
  const video = document.createElement('video');
  video.className = 'hero-background-video';
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  video.src = config.videoSrc;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  video.preload = 'metadata';
  if (config.poster) video.poster = config.poster;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const play = () => video.play().catch(() => { /* Keep the static background if autoplay is blocked. */ });
  motion.addEventListener('change', () => { if (motion.matches) video.pause(); else play(); });
  container.prepend(video);
  if (!motion.matches) play();
}
