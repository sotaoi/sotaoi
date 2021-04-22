import { Lang } from '@sotaoi/omni/state';

// todo lowprio: quick service (no abstraction or provider)

class LangService {
  protected available: null | Lang[] = null;
  protected multilang = false;

  public async getLangData(): Promise<{
    'app.lang.selected': Lang;
    'app.lang.default': Lang;
    'app.lang.available': [Lang];
    'app.lang.translations': { [key: string]: { [key: string]: string } };
  }> {
    // todo highprio: implement
    const lang: Lang = {
      code: 'en',
      name: 'English',
    };
    return {
      'app.lang.selected': lang,
      'app.lang.default': lang,
      'app.lang.available': [lang],
      'app.lang.translations': {
        en: {
          'app.general.welcome': 'Welcome to Alarmer',
        },
      },
    };
  }
}

const lang = (): LangService => {
  return new LangService();
};

export { lang };
