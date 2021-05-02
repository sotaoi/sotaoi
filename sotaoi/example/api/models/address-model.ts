import { Model } from '@sotaoi/api/db/model';
import { RecordEntry } from '@sotaoi/omni/artifacts';
import { FieldSchemaInit } from '@sotaoi/api/db/driver';

class AddressModel extends Model {
  public repository(): string {
    return 'address';
  }

  public schema(): FieldSchemaInit {
    return {
      uuid: {
        type: String,
        index: {
          unique: true,
        },
      },
      street: {
        type: String,
      },
      country: {
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

  public async view(address: RecordEntry): Promise<RecordEntry> {
    await this.with(address, 'country:view');
    return address;
  }
}

export { AddressModel };
