import type { Snippet } from '../../types';
import { BaseFeature } from '@features/BaseFeature';
import { Settings } from '~/Settings';

export class MonacoSnippet extends BaseFeature {
  public static shouldRunOnce = true;

  public handle(): boolean {
    if (window.monaco) {
      window.monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: () => this.getMonacoSnippets(),
      });

      return true;
    }

    return false;
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
        kind: window.monaco.languages.CompletionItemKind.Snippet,
        documentation: snippet.key,
        insertText: snippet.value,
      };
    });
  }
}
