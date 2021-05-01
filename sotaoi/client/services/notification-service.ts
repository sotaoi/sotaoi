import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  SweetAlertOptions,
  SweetAlertResult,
  Awaited,
  SweetAlert2,
  ReactSweetAlert,
} from '@sotaoi/omni/definitions/notification-interface';
import { Notification, PushRoute } from '@sotaoi/omni/contracts/notification';
import { CommandResult, QueryResult, ActionConclusion, AuthResult, TaskResult } from '@sotaoi/omni/transactions';

class NotificationService extends Notification {
  public swal: SweetAlert2 & ReactSweetAlert;

  constructor(pushRoute: PushRoute) {
    super(pushRoute);
    this.swal = withReactContent(Swal);
  }

  public async fire<T = any>(options: SweetAlertOptions<T>): Promise<SweetAlertResult<Awaited<T>>> {
    return this.swal.fire(options);
  }

  public process<T = any>(
    result: CommandResult | QueryResult | AuthResult | TaskResult,
  ): Promise<SweetAlertResult<Awaited<T>>> {
    if (!result.success) {
      return this.swal.fire({
        icon: 'warning',
        title: result.title,
        text: result.msg,
      });
    }

    return this.swal.fire({
      icon: 'success',
      title: result.title,
      text: result.msg,
    });
  }

  public conclusion<T = any>(result: CommandResult | QueryResult | AuthResult | TaskResult): ActionConclusion<T> {
    return new ActionConclusion(result, this, this.pushRoute);
  }
}

export { NotificationService };
