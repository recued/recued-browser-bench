import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const digest = value => createHash('sha256').update(value).digest('hex');
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}

// The frozen binary does not auto-install this optional pack. Use its normal
// publisher-verified installer, and refuse catalog drift before measuring.
export async function installCatalogPack(client, root, slug) {
  const directory = join(root, 'harness/recued/catalog');
  const pins = JSON.parse(readFileSync(join(directory, slug === 'browser-toolkit' ? 'pins.json' : `${slug}-pins.json`)));
  const expected = new Map();
  for (const pin of pins.files) {
    const bytes = readFileSync(join(directory, `${pin.slug}.json`));
    if (digest(bytes) !== pin.sha256) throw new Error(`Pinned catalog file changed: ${pin.slug}`);
    expected.set(pin.slug, JSON.parse(bytes));
    const fetched = spawnSync('curl', ['--fail', '--location', '--silent', '--show-error', '--connect-timeout', '15', '--max-time', '60', pin.url], { maxBuffer: 2_000_000 });
    if (fetched.status !== 0 || digest(fetched.stdout) !== pin.sha256) throw new Error(`Published catalog no longer matches the pinned release: ${pin.slug}. See harness/recued/catalog/README.md.`);
  }
  const manifest = expected.get(slug);
  // Marketplace preview resolves app-pack content recipes and normalizes its
  // manifest just as installBySlug does. Its review hash binds that server view.
  const preview = await client.call('packs.install_preview', { manifest, marketplace: true }, 120_000);
  const installed = await client.call('packs.installBySlug', {
    slug: manifest.slug, ...(preview.update_tests?.manifest_hash ? { expected_manifest_hash: preview.update_tests.manifest_hash } : {}),
    granted_permissions: manifest.requires ?? [], install_scope: { access: 'all' },
  }, 240_000);
  if (!installed.result?.ok) throw new Error(`Released ${manifest.name} install failed: ${JSON.stringify(installed.result?.failure)}`);
  const recipes = [];
  const references = [...new Map([...(manifest.recipes ?? []), ...(manifest.contents ?? []).filter(entry => entry.type === 'recipe')].map(ref => [ref.slug, ref])).values()];
  for (const reference of references) {
    const wanted = expected.get(reference.slug);
    const actual = (await client.call('recipe.get', { recipe_id: reference.slug })).recipe;
    if (!actual || actual.publisher_id !== wanted.publisher_id || actual.version !== wanted.version) throw new Error(`Installed ${manifest.name} recipe differs from the pinned release: ${reference.slug}`);
    // The release installer lowers canonical op steps to its own operations.
    // Preserve the resulting hash separately from the original catalog bytes.
    recipes.push({ slug: reference.slug, version: actual.version, installed_sha256: digest(canonical(actual.recipe)), lowered: canonical(actual.recipe) !== canonical(wanted.recipe) });
  }
  return { pack_slug: slug, version: manifest.version, catalog_tag: pins.catalogTag, manifest_sha256: pins.files[0].sha256, recipes_verified: references.length, recipes,
    catalogs: (manifest.contents ?? []).filter(entry => entry.type === 'composition').map(entry => entry.composition.slug) };
}
export const installBrowserToolkit = (client, root) => installCatalogPack(client, root, 'browser-toolkit');
