import { RecordEntry, RecordRef, Record } from '@sotaoi/omni/artifacts';
import { db } from '@sotaoi/api/db';
// import { QueryBuilder } from 'knex';
import { Setup } from '@sotaoi/api/setup';
import { ModelOperations } from '@sotaoi/api/models/model-operations';
import { Schema, Model as DbModel } from '@sotaoi/api/db';

abstract class Model {
  abstract repository(): string;
  abstract schema(): Schema;
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

  public async standardize(record: { [key: string]: any } | { [key: string]: any }[]): Promise<Record | Record[]> {
    const modelOperations = this.getModelOperations();
    const records = record instanceof Array ? record : [record];
    for (let i = 0; i < records.length; i++) {
      const standardized = await modelOperations.standardize(records[i]);
      Object.keys(record).map((prop) => {
        if (typeof standardized[prop] !== 'undefined') {
          records[i][prop] = standardized[prop];
          delete standardized[prop];
          return;
        }
        delete records[i][prop];
      });
      Object.keys(standardized).map((prop) => {
        records[i][prop] = standardized[prop];
      });
    }
    return (record instanceof Array ? records : records[0]) as Record | Record[];
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
      // todo here: imporant
      // const modelDb = model.db(model.repository());
      // const relRecords: { [key: string]: RecordEntry } = {};
      // for (const relRecord of (await modelDb.whereIn(key, refs[repository])) || []) {
      //   relRecords[new RecordRef(rel, relRecord.uuid).serialize(false)] = await model.transform(relRecord, relVariant);
      // }
      // records.map((record) => {
      //   record[rel] && (record[rel] = relRecords[record[rel]]);
      // });
    }
  }

  // public db(repository: string): QueryBuilder {
  public db(repository: null | string = null): DbModel<any> {
    !repository && (repository = this.repository());
    return ModelOperations.get(repository);
  }

  // todo here: move transform to model operations
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
