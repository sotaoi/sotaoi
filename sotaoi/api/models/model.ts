import { RecordEntry, RecordRef, Record } from '@sotaoi/omni/artifacts';
import { db } from '@sotaoi/api/db';
import { QueryBuilder } from 'knex';

abstract class Model {
  abstract async repository(): Promise<string>;
  abstract async hidden(): Promise<string[]>;
  abstract async view(record: RecordEntry): Promise<RecordEntry>;

  public async with(record: RecordEntry | RecordEntry[], relstring: string, key = 'uuid'): Promise<void> {
    const [rel, secondVariant = null, secondKey = 'uuid'] = relstring.split(':');
    const _this: any = this;
    const model = await _this[rel]();
    const records = record instanceof Array ? record : [record];
    const refs: string[] = [];
    records.map((record) => record[rel] && refs.push(JSON.parse(record[rel]).uuid));
    if (!refs.length) {
      return;
    }
    const dbc = model.db(await model.repository());
    const relRecords: { [key: string]: RecordEntry } = {};
    for (const relRecord of (await dbc.whereIn(key, refs)) || []) {
      relRecords[new RecordRef(rel, relRecord.uuid).serialize(false)] = await model.transform(
        relRecord,
        secondVariant,
        secondKey,
      );
    }
    records.map((record) => {
      record[rel] && (record[rel] = relRecords[record[rel]]);
    });
  }

  public db(repository: string): Promise<QueryBuilder> {
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
