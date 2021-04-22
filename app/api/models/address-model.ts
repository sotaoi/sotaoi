import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';

class AddressModel extends Model {
  public repository(): string {
    return 'address';
  }

  public async hidden(): Promise<string[]> {
    return [];
  }

  public async view(address: RecordEntry): Promise<RecordEntry> {
    await this.with(address, 'country:view');
    return address;
  }
}

export { AddressModel };
