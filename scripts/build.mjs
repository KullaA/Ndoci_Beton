import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist/Media', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });
// Only the required logo and explicitly configured media enter the build.
await copyFile('Media/Ndoci_Beton_Logo.jpeg', 'dist/Media/Ndoci_Beton_Logo.jpeg');
const { media } = await import('../src/config.js');
for (const path of [media.videoSrc, media.poster]) {
  if (!path) continue;
  if (!path.startsWith('./Media/') || path.includes('..')) throw new Error('Use a local ./Media/ path for video and poster.');
  await copyFile(path, `dist/${path.slice(2)}`);
}
console.log('Built static website in dist/.');
