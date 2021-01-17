import { AuthRecord } from '@sotaoi/omni/artifacts';

class State {
  public 'app.meta.title': string;
  public 'app.credentials.authRecord': null | AuthRecord;
  public 'app.lang.selected': Lang;
  public 'app.lang.default': Lang;
  public 'app.lang.available': Lang[];
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
}

interface AppInfo {
  name: string;
  packageName: string;
  prodDomain: string;
  devDomain: string;
  prodDomainAlias: string;
  devDomainAlias: string;
  prodApiUrl: string;
  devApiUrl: string;
  devMobileApiUrl: string;
  prodClientUrl: string;
  devClientUrl: string;
  mobileBundleLocation: string;
  translationsUrl: string;
  privacyPolicyUrl: string;
  termsOfUseUrl: string;
  deploymentInstance: string;
  devApiDomain: string;
  devApiPort: number;
  devClientDomain: string;
  devClientPort: number;
  devStreamingDomain: string;
  devStreamingPort: number;
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
