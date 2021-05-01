import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Store } from '@sotaoi/client/contracts/store';
import { Lang } from '@sotaoi/omni/state';
import { Lang as LangContract } from '@sotaoi/client/contracts/lang';

class LangService extends LangContract {
  protected available: null | Lang[] = null;
  protected multilang = false;

  public async init(store: () => Store): Promise<void> {
    const selectedLang = store().getSelectedLang();
    const defaultLang = store().getDefaultLang();

    this.available = store().getAvailableLangs();
    this.multilang = this.available && this.available.length > 1;

    const resources: Resource = {};
    for (const [lang, translations] of Object.entries(store().getTranslations())) {
      resources[lang] = { translation: translations };
    }

    i18n.use(initReactI18next).init({
      resources,
      lng: selectedLang.code,
      fallbackLng: defaultLang.code,

      interpolation: {
        escapeValue: false,
      },
    });
  }

  public isMultilang(): boolean {
    return this.multilang;
  }

  protected availableLangs(): Lang[] {
    if (!this.available) {
      return [];
    }
    return this.available;
  }
}

export { LangService };
