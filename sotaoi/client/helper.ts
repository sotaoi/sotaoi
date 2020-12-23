import { Helper as OmniHelper } from '@sotaoi/omni/helper';

class Helper extends OmniHelper {
  public static setTitle(title: string): void {
    switch (true) {
      case this.isWeb():
        document.title = title;
        break;
      case this.isMobile():
        // nothing here yet
        break;
      case this.isElectron():
        console.warn('nothing here yet');
        break;
      default:
        throw new Error('unknown environment');
    }
  }

  public static uuid(): string {
    let uuid = '',
      i,
      random;
    for (i = 0; i < 32; i++) {
      random = (Math.random() * 16) | 0;
      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += '-';
      }
      uuid += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
    }
    return uuid;
  }

  public static isWeb(): boolean {
    return typeof document !== 'undefined';
  }

  public static isMobile(): boolean {
    return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
  }

  public static isElectron(): boolean {
    return typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
  }

  public static encodeSegment(segment: { [key: string]: any }): string {
    const encodedSegment: string[] = [];
    Object.entries(segment).map(([key, value]) => {
      encodedSegment.push(`${key}=${encodeURIComponent(typeof value === 'string' ? value : JSON.stringify(value))}`);
    });
    return encodedSegment.join('&');
  }

  public static decodeSegment(segment: string): { [key: string]: string } {
    if (typeof segment !== 'string') {
      return {};
    }
    const decodedSegment: { [key: string]: any } = {};
    const segments = segment.split('&');
    segments.map((segment) => {
      const split = segment.split('=');
      decodedSegment[split[0]] = split[1] || true;
    });
    return decodedSegment;
  }

  public static asset(item: null | string, role = 'assets'): null | string {
    if (!item) {
      return null;
    }
    if (!this.isJson(item)) {
      return item;
    }
    const parsed = JSON.parse(item);
    return `/api/storage/${parsed.drive}/${role}/${parsed.domain}/${parsed.group}/${parsed.division}/${parsed.pathname}`;
  }
}

export { Helper };
export type { TransformerFn } from '@sotaoi/omni/helper';
