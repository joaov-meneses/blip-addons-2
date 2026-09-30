import { normalizeModules } from './ModuleSettings';

// The vendor mounts the creation button in these marked containers. Keeping this
// adapter separate preserves its runtime and editing of existing integrations.
const CREATION_BUTTON = '[data-ww-integration-button-mounted="true"] > div > bds-button[icon="plugin"]';
let enabled = false;
const updateDocument = (): void => {
  document.documentElement?.setAttribute('data-blip-addons-new-integration', enabled ? 'enabled' : 'disabled');
};
const apply = (settings: any): void => {
  enabled = normalizeModules(settings?.modules).newIntegration;
  updateDocument();
};

// document_start may run before <html> exists. CSS hides the button until ready.
if (document.documentElement) updateDocument();
else {
  const observer = new MutationObserver(() => {
    if (document.documentElement) { updateDocument(); observer.disconnect(); }
  });
  observer.observe(document, { childList: true });
}

window.addEventListener('click', event => {
  if (enabled) return;
  if (event.composedPath().some(node => node instanceof Element && node.matches(CREATION_BUTTON))) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);

let storageRevision = 0;
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.settings) {
    storageRevision++;
    apply(changes.settings.newValue);
  }
});
const revisionAtRead = storageRevision;
chrome.storage.sync.get('settings', result => {
  if (storageRevision === revisionAtRead) apply(result.settings);
});
