import { AuthResult } from '@sotaoi/omni/transactions';
import { AuthCommand } from '@sotaoi/api/commands';
import { db } from '@sotaoi/api/db';
import { AuthRecord } from '@sotaoi/omni/artifacts';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { Helper } from '@sotaoi/api/helper';

// todo here: generate token

class AuthUserHandler extends AuthHandler {
  public getFormId = async (): Promise<string> => 'auth-user-form';

  public async handle(command: AuthCommand): Promise<AuthResult> {
    const user = await db('user')
      .where('email', command.payload.email.serialize(true))
      .where('password', command.payload.password.serialize(true))
      .first();
    if (!user) {
      return new AuthResult(true, null, {
        code: 401,
        title: 'Error',
        msg: 'Invalid credentials',
        validations: null,
      });
    }
    const accessToken = Helper.uuid();
    // better token encryption needed here
    const authRecord = new AuthRecord('user', user.uuid, user.createdAt, true);
    await db('access-token').insert({
      uuid: Helper.uuid(),
      user: authRecord.serial,
      token: accessToken,
    });
    this.saveAccessToken(accessToken);
    return new AuthResult(
      true,
      {
        code: 200,
        title: 'Success',
        msg: 'Authentication success',
        authRecord,
        accessToken,
      },
      null,
    );
  }
}

export { AuthUserHandler };
