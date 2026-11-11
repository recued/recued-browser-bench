import { liveSiteMissing } from '../harness/live-site/site.mjs';

const words = text => String(text).normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().toLowerCase();
export function checkedOracle(task, oracle) {
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const available = task.reads_the_page_after === 'top_story' ? text(oracle.title) && Number.isInteger(oracle.points)
    : task.reads_the_page_after === 'caption' ? text(oracle.caption)
    : task.reads_the_page_after === 'see_also' ? text(oracle.title) : true;
  return oracle.error || available ? oracle : { ...oracle, error: 'live page check unavailable: expected page content missing' };
}
export function grade(task, result, oracle = {}, events = []) {
  oracle = checkedOracle(task, oracle);
  const answer = result.answer ?? '';
  const missing = (task.expect ?? []).filter(e => !new RegExp(e.pattern, e.flags).test(answer)).map(e => `answer: ${e.pattern}`);
  if (result.timed_out) missing.push('time limit');
  if (result.error) missing.push(result.error);
  if (typeof result.seconds !== 'number' || !Number.isFinite(result.seconds)) missing.push('answer clock unavailable');
  if (typeof result.rounds !== 'number') missing.push('model round count unavailable');
  if (task.live_events) {
    const error = liveSiteMissing(events, task.live_events);
    if (error) missing.push(error);
  }
  const normalized = words(answer);
  if (task.reads_the_page_after) {
    if (oracle.error) missing.push('live page check unavailable');
    else if (task.reads_the_page_after === 'top_story') {
      if (!oracle.title || !normalized.includes(words(oracle.title))) missing.push('current top story title');
      if (!Number.isInteger(oracle.points) || !new RegExp(`\\b${oracle.points}\\b`).test(answer.replaceAll(',', ''))) missing.push('current top story points');
    } else if (task.reads_the_page_after === 'caption') {
      const required = [...new Set(String(oracle.caption ?? '').match(/\p{L}{5,}|\d{4}/gu) ?? [])].filter(w => !/^lovelace$/i.test(w));
      if (!required.length) missing.push('live caption unavailable');
      else for (const word of required) if (!normalized.includes(words(word))) missing.push(`caption: ${word}`);
    } else if (task.reads_the_page_after === 'see_also') {
      if (!oracle.title || !normalized.includes(words(oracle.title))) missing.push('last See also title');
    }
  }
  if (task.id === 'J' && !result.evidence?.uploaded) missing.push('actual upload action');
  if (task.id === 'L' && !result.evidence?.saved_file) missing.push('saved file of 12499601 bytes');
  return { right: missing.length === 0, missing: [...new Set(missing)] };
}

// Out-of-band, identical for every arm. Launched only after the measured answer.
export async function pageOracle(task, installation) {
  if (!task.reads_the_page_after) return {};
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ executablePath: installation.chromium, headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    const response = await page.goto(task.id === 'B' ? 'https://news.ycombinator.com/' : 'https://en.wikipedia.org/wiki/Ada_Lovelace', { waitUntil: 'domcontentloaded', timeout: 45_000 });
    if (response && response.status() >= 400) return { error: `live page check unavailable: HTTP ${response.status()}`, http_status: response.status() };
    if (task.id === 'B') return checkedOracle(task, await page.evaluate(() => {
      const row = document.querySelector('.athing');
      return { title: row?.querySelector('.titleline > a')?.textContent?.trim(), points: Number(row?.nextElementSibling?.querySelector('.score')?.textContent?.match(/\d+/)?.[0]) };
    }));
    if (task.id === 'C') return checkedOracle(task, { caption: await page.locator('.infobox-caption').first().innerText() });
    return checkedOracle(task, { title: await page.evaluate(() => {
      const section = document.querySelector('section[aria-labelledby="See_also"]');
      if (section) return [...section.querySelectorAll('li')].at(-1)?.textContent?.trim();
      const heading = document.querySelector('#See_also')?.closest('.mw-heading') ?? document.querySelector('#See_also');
      for (let sibling = heading?.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
        if (/^H[2-6]$/.test(sibling.tagName) || sibling.classList.contains('mw-heading')) break;
        const items = sibling.querySelectorAll('li');
        if (items.length) return items[items.length - 1].textContent.trim();
      }
      return null;
    }) });
  } catch { return { error: 'live page check unavailable' }; }
  finally { await browser.close(); }
}
