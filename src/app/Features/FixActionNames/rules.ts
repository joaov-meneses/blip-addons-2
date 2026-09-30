export type ActionNameRule = { type: string; enabled: boolean; template: string };

export const DEFAULT_ACTION_NAME_RULES: ActionNameRule[] = [
  { type: 'TrackEvent', enabled: true, template: 'Track "{{category}}"' },
  { type: 'ExecuteScript', enabled: true, template: 'Process "{{outputVariable}}"' },
  { type: 'ProcessHttp', enabled: true, template: 'Request "{{responseBodyVariable}}" using "{{method}}"' },
  { type: 'ProcessCommand', enabled: true, template: 'Request "{{variable}}" using "{{method}}"' },
  { type: 'SetVariable', enabled: true, template: 'Set "{{value}}" to "{{variable}}"' },
];

export function normalizeActionNameRules(value: unknown): ActionNameRule[] {
  return DEFAULT_ACTION_NAME_RULES.map(defaultRule => {
    const saved = Array.isArray(value) && value.find(rule => rule && rule.type === defaultRule.type);
    return {
      ...defaultRule,
      enabled: saved && typeof saved.enabled === 'boolean' ? saved.enabled : defaultRule.enabled,
      template: saved && typeof saved.template === 'string' && saved.template.length <= 500
        ? saved.template : defaultRule.template,
    };
  });
}

type Action = { type: string; settings?: Record<string, unknown>; $title?: string };
export type ActionNameChange = { action: Action; before: string; after: string };
export type ActionNamePlan = {
  changes: ActionNameChange[];
  unchanged: number;
  skipped: { type: string; missing: string[] }[];
};

// Action settings and extension metadata are user data, never other actions.
const DATA_KEYS = new Set(['settings', '$cardContent', 'content', 'addonsComments', 'addonsSettings', '$whiteWallIntegration']);

export function planActionNames(flow: unknown, rules: ActionNameRule[], simplifyVariables = true): ActionNamePlan {
  const enabled = new Map(normalizeActionNameRules(rules).filter(rule => rule.enabled).map(rule => [rule.type, rule]));
  if ([...enabled.values()].some(rule => !rule.template.trim())) throw new Error('empty-template');
  const plan: ActionNamePlan = { changes: [], unchanged: 0, skipped: [] };
  const visited = new WeakSet<object>();
  const pending: any[] = [flow];

  while (pending.length) {
    const node = pending.pop();
    if (!node || typeof node !== 'object' || visited.has(node)) continue;
    visited.add(node);
    const rule = enabled.get(node.type === 'ExecuteScriptV2' ? 'ExecuteScript' : node.type);
    if (rule) {
      const missing = new Set<string>();
      const settings = node.settings;
      let title = rule.template.replace(/{{\s*([^{}]+?)\s*}}/g, (match, key: string) => {
        const name = key.trim();
        const value = settings && Object.prototype.hasOwnProperty.call(settings, name) ? settings[name] : undefined;
        if (value == null || !['string', 'number', 'boolean'].includes(typeof value)) {
          missing.add(name);
          return match;
        }
        return String(value);
      });
      if (missing.size || !title.trim()) {
        plan.skipped.push({ type: node.type, missing: [...missing] });
      } else {
        if (simplifyVariables) title = title.replace(/{{([^{}]+)}}/g, '{$1}');
        if (node.$title === title) plan.unchanged++;
        else plan.changes.push({ action: node, before: node.$title || '', after: title });
      }
      continue;
    }
    // Do not descend into disabled or unsupported actions (e.g. message payloads).
    if (typeof node.type === 'string' && Object.prototype.hasOwnProperty.call(node, 'settings')) continue;
    const children = Object.keys(node).filter(key => !DATA_KEYS.has(key));
    for (let i = children.length - 1; i >= 0; i--) pending.push(node[children[i]]);
  }
  return plan;
}

export function applyActionNames(flow: unknown, rules: ActionNameRule[], simplifyVariables = true): ActionNamePlan {
  const plan = planActionNames(flow, rules, simplifyVariables);
  plan.changes.forEach(change => { change.action.$title = change.after; });
  return plan;
}
