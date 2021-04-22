import { AuthRecord } from '@sotaoi/omni/artifacts';

class State {
  public 'app.meta.title': string;
  public 'app.credentials.authRecord': null | AuthRecord;
  public 'app.lang.selected': Lang;
  public 'app.lang.default': Lang;
  public 'app.lang.available': Lang[];
  public 'app.lang.translations': { [key: string]: { [key: string]: string } };
}

class Lang {
  public name: string;
  public code: string;

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }
}

class Seed {
  public 'app.meta.title': string;
  public 'app.credentials.accessToken': null | string;
  public 'app.credentials.authRecord': null | AuthRecord;
  public 'app.lang.selected': Lang;
  public 'app.lang.default': Lang;
  public 'app.lang.available': Lang[];
  public 'app.lang.translations': { [key: string]: { [key: string]: string } };
}

interface AppInfo {
  name: string;
  bundleId: string;
  packageName: string;
  localDomain: string;
  localDomainAlias: string;
  devDomain: string;
  devDomainAlias: string;
  stageDomain: string;
  stageDomainAlias: string;
  prodDomain: string;
  prodDomainAlias: string;
  mobileBundleLocation: string;
  translationsUrl: string;
  privacyPolicyUrl: string;
  termsOfUseUrl: string;
  streamingBaseUrl: string;
  streamingPort: string;
  greenlockExecution: string;
  sslMaintainer: string;
}

interface RouterPropsConfig {
  [key: string]: {
    prefix: string;
    layout: React.FunctionComponent<LayoutProps>;
    routes: {
      [key: string]: React.FunctionComponent<any> | React.ComponentClass<any, any>;
    };
    condition: () => boolean;
  };
}

interface LayoutProps {
  children: any;
}

export { State, Lang, Seed };
export type { AppInfo, RouterPropsConfig, LayoutProps };
