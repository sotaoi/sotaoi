import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { Model } from '@sotaoi/api/models/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';

abstract class RetrieveHandler {
  abstract model(): Promise<Model>;
  abstract handle(retrieve: Retrieve): Promise<RetrieveResult>;

  public async transform(record: RecordEntry, variant: null | string): Promise<RecordEntry> {
    return await (await this.model()).transform(record, variant);
  }

  public async with(record: RecordEntry | RecordEntry[], rel: string, key = 'uuid'): Promise<void> {
    await (await this.model()).with(record, rel, key);
  }
}

export { RetrieveHandler };
