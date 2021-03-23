import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';

class CountryModel extends Model {
  public async repository(): Promise<string> {
    return 'country';
  }

  public async hidden(): Promise<string[]> {
    return [];
  }

  public async view(country: RecordEntry): Promise<RecordEntry> {
    return country;
  }
}

export { CountryModel };
