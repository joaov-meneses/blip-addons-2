export const DEFAULT_MODULES = {
  globalInactivity: true,
  setGlobalTrackings: true,
  removeGlobalTrackings: true,
  checkInconsistencies: false,
  botStatistics: false,
  qualityChecker: false,
  fixActionNames: true,
  newIntegration: true,
};

export type ModuleKey = keyof typeof DEFAULT_MODULES;

export function normalizeModules(value: unknown, previous = DEFAULT_MODULES): typeof DEFAULT_MODULES {
  const modules = { ...previous };
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of Object.keys(DEFAULT_MODULES)) {
      if (Object.prototype.hasOwnProperty.call(value, key) && typeof value[key] === 'boolean') modules[key] = value[key];
    }
  }
  return modules;
}
