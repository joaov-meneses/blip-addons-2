import { GetVariable } from './Commands';
import { Resolver } from './Resolver';
import { requestFeature } from './Utils';
import * as Features from './Features';
import { mergeSettings, Settings } from './Settings';
import { isBridgeMessage, postBridgeMessage } from './Bridge';

export class BlipAddons {
  public onReadyCallback: () => any;
  private ready = false;
  private started = false;

  private publishSettings(): void {
    postBridgeMessage({ isSettingsUpdate: true, newSettings: Settings, isFromClient: false });
  }

  private onMessage(event: MessageEvent): void {
    if (!isBridgeMessage(event)) return;
    const message = event.data;
    if (message.isBlipsResponse) {
      Resolver.resolve(message.identifier, message.result);
    } else if (message.isSettingsUpdate && message.isFromClient) {
      mergeSettings(message.newSettings);
      chrome.storage.sync.set({ settings: Settings });
    } else if (message.isHandshake) {
      this.ready = true;
      this.publishSettings();
    }
  }

  public start(): this {
    if (this.started) return this;
    this.started = true;
    // Install the receiver and load persisted preferences before the page handshake.
    window.addEventListener('message', event => this.onMessage(event));
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.settings) {
        mergeSettings(changes.settings.newValue);
        this.publishSettings();
      }
    });
    chrome.storage.sync.get('settings', result => {
      mergeSettings(result.settings);
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('js/listener.js');
      script.onload = () => script.remove();
      script.onerror = () => console.error('[Blip Addons 2.0] Falha ao carregar o módulo do Builder.');
      (document.head || document.documentElement).appendChild(script);
    });
    return this;
  }

  public onBuilderLoad(callback: () => any): void {
    this.onReadyCallback = callback;
    const poll = async (): Promise<void> => {
      let delay = 500;
      try {
        if (this.ready) {
          const isReady = await GetVariable.execute('isLoading') === false;
          if (isReady) { this.onReadyCallback(); delay = 1500; }
          else this.cleanFeatures();
        }
      } catch (error) {
        console.warn('[Blip Addons 2.0] Builder indisponível', error);
      } finally {
        window.setTimeout(poll, delay);
      }
    };
    void poll();
  }

  public runFeatures(): void {
    Object.values(Features).filter(Feature => !Feature.isUserTriggered)
      .forEach(Feature => requestFeature(Feature.code, 'run'));
  }

  public cleanFeatures(): void {
    Object.values(Features).forEach(Feature => requestFeature(Feature.code, 'cleanup'));
  }
}
