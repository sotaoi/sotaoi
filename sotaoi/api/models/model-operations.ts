import { Model } from '@sotaoi/api/models/model';
import { model as dbModel, Schema } from '@sotaoi/api/db';
import { DbModel } from '@sotaoi/omni/transactions';

class ModelOperations {
  protected model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  public static get(model: string): DbModel<any> {
    try {
      return dbModel(model);
    } catch (err) {
      return dbModel(model, new Schema({}, { collection: model, strict: false, timestamps: true }));
    }
  }

  public async cleanupDocs(): Promise<void> {
    // const model = ModelOperations.get(this.model.repository());
    // await model.deleteMany({
    //   $or: [
    //     { uuid: { $exists: false } },
    //     { uuid: null },
    //     { uuid: '' },
    //     { createdAt: { $exists: false } },
    //     { createdAt: null },
    //     { createdAt: '' },
    //   ],
    // });
  }
}

export { ModelOperations };
