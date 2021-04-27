import { Model } from '@sotaoi/api/db/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { FieldSchemaInit } from '@sotaoi/api/db/driver';

class CountryModel extends Model {
  public repository(): string {
    return 'country';
  }

  public schema(): FieldSchemaInit {
    return {
      uuid: {
        type: String,
        index: {
          unique: true,
        },
      },
      code: {
        type: String,
      },
      name: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
      updatedAt: {
        type: Date,
      },
    };
  }

  public hidden(): string[] {
    return [];
  }

  public async view(country: RecordEntry): Promise<RecordEntry> {
    return country;
  }
}

export { CountryModel };
