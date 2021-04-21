import { Record } from '@sotaoi/omni/artifacts';
import { Model } from '@sotaoi/api/models/model';
import mongoose from 'mongoose';

class ModelOperations {
  protected model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  public static get(model: string): mongoose.Model<any> {
    try {
      return mongoose.model(model);
    } catch (err) {
      return mongoose.model(model, new mongoose.Schema({}, { strict: false }));
    }
  }

  public async cleanupDocs(): Promise<void> {
    // const model = mongoose.model(this.model.repository(), new mongoose.Schema({}, { strict: false }));
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
