import { RetrieveResult } from '@sotaoi/omni/transactions';
import { Retrieve } from '@sotaoi/omni/transactions';
import { Model } from '@sotaoi/api/db/model';
import { RecordEntry, Record } from '@sotaoi/omni/artifacts';
import { Errors } from '@sotaoi/omni/errors';

abstract class RetrieveHandler {
  abstract async model(): Promise<Model>;
  abstract async handle(retrieve: Retrieve): Promise<RetrieveResult>;

  public async __handle__(retrieve: Retrieve): Promise<RetrieveResult> {
    const result = await this.handle(retrieve);
    if (result.record && !(result.record instanceof RecordEntry)) {
      throw new Errors.ResultIsCorrupt();
    }
    return result;
  }

  public async transform(record: Record, variant: null | string): Promise<RecordEntry> {
    return await (await this.model()).transform(record, variant);
  }

  public async with(record: RecordEntry | RecordEntry[], rel: string, key = 'uuid'): Promise<void> {
    await (await this.model()).with(record, rel, key);
  }
}

export { RetrieveHandler };
