import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { CountryModel } from '@app/api/models/country-model';

class AddressModel extends Model {
  public async repository(): Promise<string> {
    return 'address';
  }

  public async hidden(): Promise<string[]> {
    return [];
  }

  public async view(address: RecordEntry): Promise<RecordEntry> {
    await this.with(address, 'country:view');
    return address;
  }

  public async country(): Promise<CountryModel> {
    return new CountryModel();
  }
}

export { AddressModel };
