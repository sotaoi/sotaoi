import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { Schema } from '@sotaoi/api/db';

class GenericModel extends Model {
  private _repository: string;

  constructor(repository: string) {
    super();
    this._repository = repository;
  }

  public repository(): string {
    return this._repository;
  }

  public schema(): Schema {
    return new Schema({}, { strict: false });
  }

  public async hidden(): Promise<string[]> {
    return [];
  }

  public async view(record: RecordEntry): Promise<RecordEntry> {
    return record;
  }
}

export { GenericModel };
