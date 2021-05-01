import { Store } from '@sotaoi/client/contracts/store';

abstract class Lang {
  abstract async init(store: () => Store): Promise<void>;
  abstract isMultilang(): boolean;
}

export { Lang };
