// Turns an inline CSS string into a React style object, so styles from the
// original design can be copied over verbatim.
const cache = new Map();

export function css(text) {
  if (!text) return {};
  if (cache.has(text)) return cache.get(text);
  const out = {};
  text.split(';').forEach(part => {
    const i = part.indexOf(':');
    if (i < 0) return;
    const rawKey = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (!rawKey || !value) return;
    let key;
    if (rawKey.startsWith('-webkit-')) {
      key = 'Webkit' + pascal(rawKey.slice(8));
    } else if (rawKey.startsWith('-ms-')) {
      key = 'ms' + pascal(rawKey.slice(4));
    } else if (rawKey.startsWith('--')) {
      key = rawKey;
    } else {
      key = camel(rawKey);
    }
    out[key] = value;
  });
  cache.set(text, out);
  return out;
}

const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const pascal = s => { const c = camel(s); return c.charAt(0).toUpperCase() + c.slice(1); };
