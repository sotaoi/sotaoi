import { AppKernel } from '@sotaoi/api/app-kernel';
import { config } from '@sotaoi/api/config';
import { Output } from '@sotaoi/api/output';
import {
  StringInput,
  NumberInput,
  RefSelectInput,
  FileInput,
  MultiFileInput,
  StringSelectInput,
  OptionsSelectInput,
  BooleanInput,
} from '@sotaoi/omni/input';
import { AuthRecord, RecordRef } from '@sotaoi/omni/artifacts';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { ResponseToolkit } from '@hapi/hapi';
import { GenericModel } from '@sotaoi/api/db/generic-model';

class ApiInit {
  // { -->
  private static _kernel: null | AppKernel = null;

  // app kernel
  public static kernel(): AppKernel {
    if (!ApiInit._kernel) {
      ApiInit._kernel = new AppKernel(config);
    }
    return ApiInit._kernel;
  }

  // for automatic payload deserialization
  public static registerInputs(): void {
    Output.registerInput(StringInput);
    Output.registerInput(NumberInput);
    Output.registerInput(FileInput);
    Output.registerInput(MultiFileInput);
    Output.registerInput(RefSelectInput);
    Output.registerInput(StringSelectInput);
    Output.registerInput(OptionsSelectInput);
    Output.registerInput(BooleanInput);
  }

  // translate access token
  public static async translateAccessToken(
    handler: ResponseToolkit,
    accessToken: string,
  ): Promise<[null | AuthRecord, null | string]> {
    const accessTokenInState = AuthHandler.getAccessToken(handler);
    if (!accessToken || typeof accessToken !== 'string' || accessTokenInState !== accessToken) {
      return [null, null];
    }
    const accessTokenRecord = await new GenericModel('access-token').db().findOne({ token: accessToken }).lean();
    if (!accessTokenRecord) {
      return [null, null];
    }
    const ref = RecordRef.deserialize(accessTokenRecord.user);
    const record = await new GenericModel(ref.repository).db().findOne({ uuid: ref.uuid }).lean();
    if (!record) {
      return [null, null];
    }
    return [new AuthRecord(ref.repository, record.uuid, record.createdAt, true), accessToken];
  }

  // deauth
  public static async deauth(handler: ResponseToolkit): Promise<void> {
    AuthHandler.removeAccessToken(handler);
  }

  // <-- }
}

export { ApiInit };
