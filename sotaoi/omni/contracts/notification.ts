import {
  SweetAlertOptions,
  SweetAlertResult,
  Awaited,
  SweetAlert2,
  ReactSweetAlert,
} from '@sotaoi/omni/definitions/notification-interface';
import { CommandResult, QueryResult, ActionConclusion, AuthResult, TaskResult } from '@sotaoi/omni/transactions';

// note: this is in omni only for technical reasons
// it was desired to have ActionConclusion class inside transactions.ts which is in @sotaoi/omni

type PushRoute = (to: string, goTop?: boolean) => void;

abstract class Notification {
  abstract swal: SweetAlert2 & ReactSweetAlert;
  abstract async fire<T = any>(options: SweetAlertOptions<T>): Promise<SweetAlertResult<Awaited<T>>>;
  abstract async process<T = any>(
    result: CommandResult | QueryResult | AuthResult | TaskResult,
  ): Promise<SweetAlertResult<Awaited<T>>>;
  abstract conclusion<T = any>(result: CommandResult | QueryResult | AuthResult | TaskResult): ActionConclusion<T>;

  protected pushRoute: PushRoute;

  constructor(pushRoute: PushRoute) {
    this.pushRoute = pushRoute;
  }
}

export { Notification };
export type { PushRoute };
