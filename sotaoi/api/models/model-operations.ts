import { Record } from '@sotaoi/omni/artifacts';
import { Model } from '@sotaoi/api/models/model';
import { model as dbModel, Model as DbModel, Schema } from '@sotaoi/api/db';

class ModelOperations {
  protected model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  public static get(model: string): DbModel<any> {
    try {
      return dbModel(model);
    } catch (err) {
      return dbModel(model, new Schema({}, { collection: model, strict: false }));
    }
  }

  public async cleanupDocs(): Promise<void> {
    const model = ModelOperations.get(this.model.repository());
    await model.deleteMany({
      $or: [
        { uuid: { $exists: false } },
        { uuid: null },
        { uuid: '' },
        { createdAt: { $exists: false } },
        { createdAt: null },
        { createdAt: '' },
      ],
    });
  }

  // standardize is a pre transform operation that ensures records have the same schema
  public async standardize(record: { [key: string]: any }): Promise<Record> {
    typeof record !== 'object' && (record = {});
    typeof record.uuid !== 'string' && (record.uuid = '');
    typeof record.createdAt === 'undefined' && (record.createdAt = null);
    return record as Record;
  }
}

export { ModelOperations };
