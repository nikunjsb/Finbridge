// Device preference only. Routes come from the application's published-page registry.
export const START_PAGE_KEY = 'atlaseveryday-start-page-v1';
export function validStartPage(value, pages) {
  return typeof value === 'string' && pages.has(value) ? value : 'overview';
}
export function readStartPage(pages, storage) {
  try { return validStartPage((storage ?? globalThis.localStorage).getItem(START_PAGE_KEY), pages); }
  catch { return 'overview'; }
}
export function writeStartPage(value, pages, storage) {
  if (typeof value !== 'string' || !pages.has(value)) return false;
  try {
    const target = storage ?? globalThis.localStorage;
    if (value === 'overview') target.removeItem(START_PAGE_KEY);
    else target.setItem(START_PAGE_KEY, value);
    return true;
  } catch { return false; }
}
export function startPageHash(hash, pages, storage) {
  // Explicit links, including #overview, always win over a device preference.
  return hash && hash !== '#' ? hash : '#' + readStartPage(pages, storage);
}
