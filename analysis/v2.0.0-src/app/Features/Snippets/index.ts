import type { Snippet } from '../../types';
import { BaseFeature } from '@features/BaseFeature';
import { Settings } from '~/Settings';
import { getController } from '~/Utils';

export class MonacoSnippet extends BaseFeature {
  public static shouldRunOnce = true;
  private provider: { dispose(): void };
  private monaco: any;
  private hooked = new WeakSet<object>();

  private captureMonaco(): void {
    const canvas = document.querySelector('#canvas');
    if (!canvas || !window.angular) return;
    const injector = window.angular.element(canvas).injector();
    if (!injector?.has?.('monacoEditorDirective')) return;
    const prototype = injector.get('monacoEditorDirective')?.[0]?.controller?.prototype;
    if (!prototype || this.hooked.has(prototype) || typeof prototype.addEditorActions !== 'function') return;
    this.hooked.add(prototype);
    const original = prototype.addEditorActions;
    const feature = this;
    prototype.addEditorActions = function(monaco, ...args) {
      const result = original.call(this, monaco, ...args);
      feature.monaco = monaco;
      if (getController()?.isLoading === false) feature.handle();
      return result;
    };
  }

  public handle(): boolean {
    if (this.provider) return true;
    this.monaco = window.monaco || this.monaco;
    if (this.monaco) {
      this.provider = this.monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: () => ({ suggestions: this.getMonacoSnippets() }),
      });

      return true;
    }

    this.captureMonaco();
    return false;
  }

  public cleanup(): void {
    this.provider?.dispose();
    this.provider = undefined;
  }

  private getMonacoSnippets(): Array<Snippet> {
    return [
      ...this.getPersonalSnippets()
    ];
  }

  private getPersonalSnippets(): Array<Snippet> {
    const personalSnippets = Settings.personalSnippets;
    return personalSnippets.map((snippet) => {
      return {
        label: snippet.key,
        kind: this.monaco.languages.CompletionItemKind.Snippet,
        documentation: snippet.key,
        insertText: snippet.value,
      };
    });
  }
}
