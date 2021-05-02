import { AuthResult } from '@sotaoi/omni/transactions';
import { AuthCommand } from '@sotaoi/api/commands';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { Helper } from '@sotaoi/api/helper';
import { UserModel } from '@app/api/models/user-model';
import { GenericModel } from '@sotaoi/api/db/generic-model';

// todo mediumprio: generate token

class AuthUserHandler extends AuthHandler {
  public getFormId = async (): Promise<string> => 'auth-user-form';

  public async handle(command: AuthCommand): Promise<AuthResult> {
    const user = await new UserModel()
      .db()
      .findOne({
        email: command.payload.email.serialize(true),
        password: command.payload.password.serialize(true),
      })
      .lean();
    if (!user) {
      return new AuthResult(401, 'Error', 'Invalid credentials', null, null, null);
    }
    const accessToken = Helper.uuid();
    // better token encryption needed here
    const authRecord = new AuthRecord('user', user.uuid, user.createdAt, true);
    await new GenericModel('access-token').db().insertMany([
      {
        uuid: Helper.uuid(),
        user: authRecord.serial,
        token: accessToken,
      },
    ]);
    this.saveAccessToken(accessToken);
    return new AuthResult(200, 'Success', 'Authentication success', authRecord, accessToken, null);
  }
}

export { AuthUserHandler };
