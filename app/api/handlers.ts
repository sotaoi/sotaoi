import { RegisterUserHandler } from '@app/api/commands/register-user-handler';
import { UpdateUserHandler } from '@app/api/commands/update-user-handler';
import { AuthUserHandler } from '@app/api/commands/auth-user-handler';
import { AllUsersQuery } from '@app/api/queries/all-users-query';
import { UserRetrieve } from '@app/api/queries/user-retrieve';
import { SetInstallStatusTask } from '@sotaoi/api/control-panel/handlers/set-install-status-task';

const handlers = {
  user: {
    store: RegisterUserHandler,
    update: UpdateUserHandler,
    query: { 'get-all': AllUsersQuery },
    retrieve: UserRetrieve,
    auth: AuthUserHandler,
  },
  controlPanel: {
    task: { 'set-install-status-task': SetInstallStatusTask },
  },
};

export { handlers };
