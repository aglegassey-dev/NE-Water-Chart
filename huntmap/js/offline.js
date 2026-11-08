// Offline map downloads. Tiles go into the "hunt-tiles" Cache Storage bucket, which the
// service worker serves cache-first, so downloaded areas work with no signal.
import { tileUrlsFor } from './layers.js';
import { lonLatToTile } from './geo.js';

export const TILE_CACHE = 'hunt-tiles';
const AREAS_KEY = 'huntmap.offlineAreas';

export const listAreas = () => { try { return JSON.parse(localStorage.getItem(AREAS_KEY)) || []; } catch { return []; } };
const saveAreas = (a) => { try { localStorage.setItem(AREAS_KEY, JSON.stringify(a)); } catch { /* storage unavailable */ } };

export function planDownload(defs, bounds, zMin, zMax) {
  const urls = new Set();
  defs.forEach((d) => tileUrlsFor(d, bounds, zMin, zMax, lonLatToTile).forEach((u) => urls.add(u)));
  return [...urls];
}

/** Download URLs into the tile cache. onProgress(done, total, failed). Returns {done, failed}. */
export async function download(urls, onProgress, signal) {
  if (!('caches' in window)) throw new Error('Offline storage is not supported in this browser');
  try { await navigator.storage?.persist?.(); } catch { /* storage unavailable */ }
  const cache = await caches.open(TILE_CACHE);
  let i = 0, done = 0, failed = 0;
  const worker = async () => {
    while (i < urls.length && !signal?.aborted) {
      const url = urls[i++];
      try {
        if (!(await cache.match(url))) {
          const r = await fetch(url, { mode: 'cors', signal });
          if (r.ok) await cache.put(url, r);
          else if (r.status !== 404) throw new Error(r.status); // 404 = blank tile (e.g. no streams here)
        }
      } catch { if (signal?.aborted) break; failed++; }
      done++;
      onProgress?.(done, urls.length, failed);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return { done, failed };
}

export function recordArea(area) { const a = listAreas(); a.unshift(area); saveAreas(a); }
export function removeAreaRecord(id) { saveAreas(listAreas().filter((a) => a.id !== id)); }

export async function clearAll() {
  if ('caches' in window) await caches.delete(TILE_CACHE);
  saveAreas([]);
}

export async function storageText() {
  try {
    const e = await navigator.storage.estimate();
    return `${(e.usage / 1048576).toFixed(0)} MB used of ~${(e.quota / 1073741824).toFixed(1)} GB available`;
  } catch { return ''; }
}
