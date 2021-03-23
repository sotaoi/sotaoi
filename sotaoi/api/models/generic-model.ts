import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';

class GenericModel extends Model {
  public async repository(): Promise<string> {
    return '';
  }

  public async hidden(): Promise<string[]> {
    return [];
  }

  public async transform(record: RecordEntry, variant: null | string): Promise<RecordEntry> {
    return record;
  }

  public async view(record: RecordEntry): Promise<RecordEntry> {
    return record;
  }
}

export { GenericModel };
