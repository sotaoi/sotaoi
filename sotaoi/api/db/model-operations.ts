import { Model } from '@sotaoi/api/db/model';
import { dbModel, DbModel, Schema } from '@sotaoi/api/db/driver';
import { GenericModel } from '@sotaoi/api/db/generic-model';

class ModelOperations {
  protected model: Model;
  protected static models: { [key: string]: Model } = {};
  protected static dbModels: { [key: string]: DbModel<any> } = {};
  protected static dynamicDbModels: { [key: string]: DbModel<any> } = {};

  constructor(model: Model) {
    this.model = model;
    if (model instanceof GenericModel) {
      return;
    }
    !ModelOperations.models[model.repository()] && (ModelOperations.models[model.repository()] = model);
    !ModelOperations.dbModels[model.repository()] &&
      (ModelOperations.dbModels[model.repository()] = dbModel(
        model.repository(),
        new Schema(
          {
            ...model.schema(),
            uuid: {
              type: String,
              index: {
                unique: true,
              },
            },
            createdAt: {
              type: Date,
            },
            updatedAt: {
              type: Date,
            },
          },
          {
            collection: model.repository(),
            strict: model.isStrict(),
            timestamps: true,
          },
        ),
      ));
  }

  public static get(model: string): DbModel<any> {
    if (this.dbModels[model]) {
      return this.dbModels[model];
    }
    if (this.dynamicDbModels[model]) {
      return this.dynamicDbModels[model];
    }
    this.dynamicDbModels[model] = dbModel(
      'dynamic_' + model,
      new Schema(GenericModel.genericSchema(), {
        collection: model,
        strict: false,
        timestamps: true,
      }),
    );
    return this.dynamicDbModels[model];
  }

  public async cleanupDocs(): Promise<void> {
    // const model = ModelOperations.get(this.model.repository(), false);
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
