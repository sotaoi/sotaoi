import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { Schema } from '@sotaoi/api/db';

class UserModel extends Model {
  public async hidden(): Promise<string[]> {
    return ['password'];
  }

  public repository(): string {
    return 'user';
  }

  public schema(): Schema {
    return new Schema({}, { strict: false });
  }

  public async view(user: RecordEntry): Promise<RecordEntry> {
    // todo here: promise all resolve here (await promise resolve all?)
    await this.with(user, 'address:view');
    return user;
  }
}

export { UserModel };
