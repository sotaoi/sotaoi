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
} from '@sotaoi/omni/input';
import { AuthRecord, RecordRef } from '@sotaoi/omni/artifacts';
import { db } from '@sotaoi/api/db';
import { AppInfo } from '@sotaoi/omni/state';
import info from '@app/omni/info.json';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { ResponseToolkit } from '@hapi/hapi';

class ApiInit {
  // { -->

  // app info
  public static getInfo(): AppInfo {
    return info;
  }

  // app kernel
  public static kernel(): AppKernel {
    return new AppKernel(config);
  }

  // for automatic payload deserialization
  public static registerInputs(): void {
    Output.registerInput(StringInput);
    Output.registerInput(NumberInput);
    Output.registerInput(FileInput);
    Output.registerInput(MultiFileInput);
    Output.registerInput(RefSelectInput);
    Output.registerInput(StringSelectInput);
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
    const accessTokenRecord = await db('access-token').where('token', accessToken).first();
    if (!accessTokenRecord) {
      return [null, null];
    }
    const ref = RecordRef.deserialize(accessTokenRecord.user);
    const record = await db(ref.repository).where('uuid', ref.uuid).first();
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
