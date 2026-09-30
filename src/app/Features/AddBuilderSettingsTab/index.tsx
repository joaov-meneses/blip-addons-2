import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseFeature } from '../BaseFeature';
import { GeneralSettingsModules } from './GeneralSettingsModules';

const TAB_ID = 'blip-addons-general-tab';

// A public property schedules the native Stencil tab group to read
// its live collection again. Restore alignment before the scheduled render.
function refreshTabs(group: HTMLElement): void {
  const nativeGroup = group as HTMLElement & { align: string };
  const alignment = nativeGroup.align || 'center';
  nativeGroup.align = alignment === 'left' ? 'right' : 'left';
  nativeGroup.align = alignment;
}

export class AddBuilderSettingsTab extends BaseFeature {
  public static shouldRunOnce = true;
  private observer: MutationObserver;
  private group: HTMLElement;
  private tab: HTMLElement;
  private mount: HTMLElement;
  private scheduled = false;
  private timer: number;

  private keyboard = (event: KeyboardEvent): void => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const headers = Array.from(this.group?.shadowRoot?.querySelectorAll<HTMLElement>('.tab_group__header__itens__item') || []);
    const target = event.composedPath().find(node => headers.includes(node as HTMLElement)) as HTMLElement;
    if (!target) return;
    const index = headers.indexOf(target);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? headers.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + headers.length) % headers.length;
    event.preventDefault();
    event.stopImmediatePropagation();
    headers[next].focus();
    headers[next].scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };

  private detach = (): void => {
    const group = this.group;
    group?.removeEventListener('keydown', this.keyboard, true);
    if (this.mount) ReactDOM.unmountComponentAtNode(this.mount);
    const wasOpen = this.tab?.hasAttribute('open');
    this.tab?.remove();
    if (group?.isConnected) {
      if (wasOpen) group.querySelector('bds-tab-item')?.setAttribute('open', '');
      refreshTabs(group);
    }
    this.group = this.tab = this.mount = undefined;
  };

  private reconcile = (): void => {
    const group = document.querySelector<HTMLElement>('#node-content-tab bds-tab-group.builder-sidebar-tabs');
    const isConfiguration = group?.querySelector('#variablesForm, ng-include[src*="BuilderConfigurationVariablesView"]');
    if (group === this.group && this.tab?.isConnected && isConfiguration) return;
    this.detach();
    if (!group || !isConfiguration || group.querySelector(`#${TAB_ID}`)) return;
    this.group = group;
    this.tab = document.createElement('bds-tab-item');
    this.tab.id = TAB_ID;
    this.tab.setAttribute('label', 'Builder 2.0');
    this.mount = document.createElement('div');
    this.tab.appendChild(this.mount);
    group.appendChild(this.tab);
    ReactDOM.render(<GeneralSettingsModules />, this.mount);
    group.addEventListener('keydown', this.keyboard, true);
    refreshTabs(group);
  };

  public handle(): void {
    if (this.observer) return;
    this.observer = new MutationObserver(() => {
      if (this.scheduled) return;
      this.scheduled = true;
      this.timer = window.setTimeout(() => {
        this.scheduled = false;
        if (this.observer) this.reconcile();
      }, 0);
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.reconcile();
  }

  public cleanup(): void {
    window.clearTimeout(this.timer);
    this.scheduled = false;
    this.observer?.disconnect();
    this.observer = undefined;
    this.detach();
  }
}
