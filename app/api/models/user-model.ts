import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { AddressModel } from '@app/api/models/address-model';

class UserModel extends Model {
  public async hidden(): Promise<string[]> {
    return ['password'];
  }

  public async repository(): Promise<string> {
    return 'user';
  }

  public async view(user: RecordEntry): Promise<RecordEntry> {
    // todo here: promise all resolve here (await promise resolve all?)
    await this.with(user, 'address:view');
    return user;
  }

  public async address(): Promise<Model> {
    return new AddressModel();
  }
}

export { UserModel };
