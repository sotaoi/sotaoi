import { RecordEntry, RecordRef, Record } from '@sotaoi/omni/artifacts';
import { db } from '@sotaoi/api/db';
import { QueryBuilder } from 'knex';
import { Setup } from '@sotaoi/api/setup';

abstract class Model {
  abstract async repository(): Promise<string>;
  abstract async hidden(): Promise<string[]>;
  abstract async view(record: RecordEntry): Promise<RecordEntry>;

  public async with(record: RecordEntry | RecordEntry[], relstring: string, key = 'uuid'): Promise<void> {
    const [rel, relVariant = null] = relstring.split(':');
    const _this: any = this;
    const models: { [key: string]: Model } = {};
    const records = record instanceof Array ? record : [record];
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
      const modelDb = model.db(await model.repository());
      const relRecords: { [key: string]: RecordEntry } = {};
      for (const relRecord of (await modelDb.whereIn(key, refs[repository])) || []) {
        relRecords[new RecordRef(rel, relRecord.uuid).serialize(false)] = await model.transform(relRecord, relVariant);
      }
      records.map((record) => {
        record[rel] && (record[rel] = relRecords[record[rel]]);
      });
    }
  }

  public db(repository: string): QueryBuilder {
    return db(repository);
  }

  public async transform(record: Record, variant: null | string): Promise<RecordEntry> {
    for (const hidden of await this.hidden()) {
      delete record[hidden];
    }
    const recordEntry = new RecordEntry(await this.repository(), record.uuid, record);
    const _this: any = this;
    return !variant || typeof _this[variant] !== 'function'
      ? await this.view(recordEntry)
      : await _this[variant](recordEntry);
  }
}

export { Model };
