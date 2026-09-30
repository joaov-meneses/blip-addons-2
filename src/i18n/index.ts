import { translations } from './translations';
import { Settings } from '~/Settings';

/**
 * Função de tradução que usa o idioma definido no Settings
 * @param key - Chave da tradução no formato "namespace.key" (ex: "sidebar.title")
 * @param currentLanguage - Idioma atual (opcional, usa Settings.language se não fornecido)
 * @returns Texto traduzido
 */
export const t = (key: string, currentLanguage?: string): string => {
  const lang = currentLanguage ?? Settings.language;
  const keys = key.split('.');

  let value: any = translations[lang] || translations.ptbr;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key} for language: ${lang}`);
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
};
