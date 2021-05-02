import _ from 'lodash';
import { Job } from '@sotaoi/api/job';
import { Helper } from '@sotaoi/api/helper';
import { UserModel } from '@app/api/models/user-model';

class InitialSeed extends Job {
  public async handle(): Promise<void> {
    const user = new UserModel();

    await user.db().deleteMany({});

    await user.db().insertMany({
      uuid: Helper.uuid(),
      email: 'asd@asd.com',
      password: 'asdasd',
      name: 'Asd Com',
      avatar: null,
    });
  }
}

export { InitialSeed };
