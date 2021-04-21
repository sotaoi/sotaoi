import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { Schema } from '@sotaoi/api/db';

class CountryModel extends Model {
  public repository(): string {
    return 'country';
  }

  public schema(): Schema {
    return new Schema({}, { strict: false });
  }

  public async hidden(): Promise<string[]> {
    return [];
  }

  public async view(country: RecordEntry): Promise<RecordEntry> {
    return country;
  }
}

export { CountryModel };
