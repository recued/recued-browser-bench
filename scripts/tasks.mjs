import { readFileSync } from 'node:fs';

export function taskSet(origin) {
  const tasks = JSON.parse(readFileSync(new URL('../tasks/tasks.json', import.meta.url))).tasks;
  return [...tasks,
    { id: 'X', what: 'delete the named email in a changing inbox', ask: `In my inbox (${origin}/inbox) in my browser, delete the email from Bob about invoice 1043.`, expect: [{ pattern: 'Bob', flags: 'i' }, { pattern: '1043|invoice', flags: 'i' }], live_events: [{ deleted: 'Bob — Invoice 1043 for October' }] },
    { id: 'Y', what: 'open the named offer in a rotating banner', ask: `On the offers page (${origin}/offers) in my browser, open the Winter tyres offer from the banner and tell me the code it gives.`, expect: [{ pattern: 'WT-4417', flags: 'i' }], live_events: [{ opened: 'winter-tyres' }] },
  ];
}
