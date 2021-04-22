import { RecordEntry, RecordRef, Record } from '@sotaoi/omni/artifacts';
import { Setup } from '@sotaoi/api/setup';
import { ModelOperations } from '@sotaoi/api/models/model-operations';
import { Model as DbModel } from '@sotaoi/api/db';

abstract class Model {
  abstract repository(): string;
  abstract async hidden(): Promise<string[]>;
  abstract async view(record: RecordEntry): Promise<RecordEntry>;

  public modelOperationsInstance: null | ModelOperations = null;

  public modelOperations(): typeof ModelOperations {
    return ModelOperations;
  }

  public async cleanupDocs(): Promise<void> {
    const modelOperations = this.getModelOperations();
    modelOperations.cleanupDocs();
  }

  public async with(record: RecordEntry | RecordEntry[], relstring: string, key = 'uuid'): Promise<void> {
    const records = record instanceof Array ? record : [record];
    const [rel, relVariant = null] = relstring.split(':');
    // const _this: any = this;
    const models: { [key: string]: Model } = {};
    const refs: { [key: string]: string[] } = {};
    for (const record of records) {
      if (typeof record[rel] !== 'string' || !record[rel]) {
        return;
      }
      const recordRef = RecordRef.deserialize(record[rel]);
      !models[recordRef.repository] && (models[recordRef.repository] = Setup.getModel(recordRef.repository));
      !refs[recordRef.repository] && (refs[recordRef.repository] = []);
      refs[recordRef.repository].push(recordRef.uuid);
    }
    for (const [repository, model] of Object.entries(models)) {
      if (!model) {
        continue;
      }
      const modelDb = ModelOperations.get(model.repository());
      const relRecords: { [key: string]: RecordEntry } = {};
      for (const relRecord of (await modelDb.find({ [key]: { $in: refs[repository] } }).lean()) || []) {
        relRecords[new RecordRef(rel, relRecord.uuid).serialize(false)] = await model.transform(
          Record.make(relRecord),
          relVariant,
        );
      }
      records.map((record) => {
        record[rel] && (record[rel] = relRecords[record[rel]]);
      });
    }
  }

  // public db(repository: string): QueryBuilder {
  public db(repository: null | string = null): DbModel<any> {
    !repository && (repository = this.repository());
    return ModelOperations.get(repository);
  }

  // todo mediumprio: move transform to model operations
  public async transform(record: Record, variant: null | string): Promise<RecordEntry> {
    for (const hidden of await this.hidden()) {
      delete record[hidden];
    }
    const recordEntry = new RecordEntry(this.repository(), record.uuid, record);
    const _this: any = this;
    return !variant || typeof _this[variant] !== 'function'
      ? await this.view(recordEntry)
      : await _this[variant](recordEntry);
  }

  private getModelOperations(): ModelOperations {
    if (this.modelOperationsInstance) {
      return this.modelOperationsInstance;
    }
    const modelOperationsClass = this.modelOperations();
    this.modelOperationsInstance = new modelOperationsClass(this);
    return this.modelOperationsInstance;
  }
}

export { Model };
