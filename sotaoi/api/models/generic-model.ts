import { Model } from '@sotaoi/api/models/model';
import { RecordEntry, Record } from '@sotaoi/omni/artifacts';

class GenericModel extends Model {
  private _repository: string;

  constructor(repository: string) {
    super();
    this._repository = repository;
  }

  public async repository(): Promise<string> {
    return this._repository;
  }

  public async hidden(): Promise<string[]> {
    return [];
  }

  public async view(record: RecordEntry): Promise<RecordEntry> {
    return record;
  }
}

export { GenericModel };
