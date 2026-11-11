import { homedir, tmpdir } from 'node:os';
import { isIP } from 'node:net';

export function sanitize(value, { secrets = [], paths = [], origins = [] } = {}) {
  const catalogTags = [];
  let serialized = JSON.stringify(value, (key, entry) => {
    // Calendar release tags can look like IPv4 addresses, but this field is
    // public catalog provenance rather than a client network address.
    if (key === 'catalog_tag' && /^catalog\/\d{2}\.\d{1,2}\.\d{1,2}\.\d+$/.test(entry)) {
      const token = `__PUBLIC_CATALOG_TAG_${catalogTags.length}__`;
      catalogTags.push([token, entry]); return token;
    }
    return entry;
  });
  for (const secret of secrets.filter(x => typeof x === 'string' && x.length >= 4)) serialized = serialized.split(secret).join('[redacted]');
  for (const origin of origins.filter(Boolean)) serialized = serialized.split(origin).join('[live-site]');
  const home = homedir(), temporary = tmpdir();
  // A framework may already have masked HOME before the parent supplies the
  // more specific owned checkout/task paths. Recognize those masked prefixes
  // too, so a second pass removes the remaining private directory structure.
  const masked = paths.filter(path => typeof path === 'string').flatMap(path => [home, temporary]
    .filter(prefix => prefix && path.startsWith(prefix + '/')).map(prefix => '[local]' + path.slice(prefix.length)));
  for (const path of [...paths, ...masked, home, temporary].filter(Boolean).sort((a, b) => b.length - a.length)) serialized = serialized.split(path).join('[local]');
  serialized = serialized.replace(/(?:Bearer|bearer)\s+[A-Za-z0-9._~-]+/g, 'Bearer [redacted]')
    .replace(/\b(?:sk-|gsk_|AIza)[A-Za-z0-9_-]{12,}/g, '[redacted]')
    .replace(/(?:\/Users\/|\/home\/)[^\s"\\]+/g, '[local-path]')
    .replace(/https?:\/\/(?:127\.0\.0\.1|localhost|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?::\d+)?/g, '[local-origin]');
  // Echo sites can include the client's public address in a page or error.
  serialized = serialized.replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, candidate => isIP(candidate) === 4 ? '[network-address]' : candidate);
  serialized = serialized.replace(/[A-Fa-f0-9:.]+/g, candidate => isIP(candidate) ? '[network-address]' : candidate);
  for (const [token, tag] of catalogTags) serialized = serialized.split(token).join(tag);
  return JSON.parse(serialized);
}
