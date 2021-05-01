import { Artifacts, AuthRecord, RecordEntry, Artifact } from '@sotaoi/omni/artifacts';
import { SweetAlertResult, Awaited } from '@sotaoi/omni/definitions/notification-interface';
import { Notification } from '@sotaoi/omni/contracts/notification';

abstract class ResponseToolkit<ResponseObject> {
  abstract response: (value: any) => ResponseObject;
}
abstract class ResponseObjectAbstract<ResponseObject> {
  abstract code: (statusCode: number) => ResponseObject;
}
class MsgResult<ResponseObject extends ResponseObjectAbstract<ResponseObject>> {
  public code: number;
  public title: string;
  public msg: string;

  constructor(code: number, title: string, msg: string) {
    this.code = code;
    this.title = title;
    this.msg = msg;
  }

  public async output(handler: ResponseToolkit<ResponseObject>): Promise<ResponseObject> {
    return handler.response(this).code(this.code);
  }
}

// C.R.A.Q.

class ErrorResult {
  public code: number;
  public msg: string;
  public title: string;
  public validations: null | { [key: string]: string[] };

  constructor(code: number, title: string, msg: string, validations: null | { [key: string]: string[] }) {
    this.code = code;
    this.title = title;
    this.msg = msg;
    this.validations = validations;
  }
}

class Command {
  public authRecord: null | AuthRecord;
  public artifacts: Artifacts;
  public role: null | string;
  public repository: string;

  constructor(authRecord: null | AuthRecord, artifacts: Artifacts, role: null | string, repository: string) {
    this.authRecord = authRecord;
    this.artifacts = artifacts;
    this.role = role;
    this.repository = repository;
  }
}

class CommandResult {
  public success: boolean;
  public code: number;
  public msg: string;
  public title: string;
  public artifact: null | Artifact;
  public validations: null | { [key: string]: string[] };

  constructor(
    code: number,
    msg: string,
    title: string,
    artifact: null | Artifact,
    validations: null | { [key: string]: string[] },
  ) {
    this.success = code >= 200 && code < 300 ? true : false;
    this.code = code;
    this.msg = msg;
    this.title = title;
    this.artifact = artifact;
    this.validations = validations;
  }

  public getCode(): number {
    return this.code;
  }

  public getError(): ErrorResult {
    return new ErrorResult(this.code, this.msg, this.title, this.validations);
  }
}

class RetrieveResult {
  public success: boolean;
  public code: number;
  public title: string;
  public msg: string;
  public record: null | RecordEntry;
  public validations: null | { [key: string]: string[] };

  constructor(
    code: number,
    title: string,
    msg: string,
    record: null | RecordEntry,
    validations: null | { [key: string]: string[] },
  ) {
    this.success = code >= 200 && code < 300 ? true : false;
    this.code = code;
    this.title = title;
    this.msg = msg;
    this.record = record;
    this.validations = validations;
  }

  public getCode(): number {
    return this.code;
  }
}

class AuthResult {
  public success: boolean;
  public code: number;
  public title: string;
  public msg: string;
  public authRecord: null | AuthRecord;
  public accessToken: null | string;
  public validations: null | { [key: string]: string[] };

  constructor(
    code: number,
    title: string,
    msg: string,
    authRecord: null | AuthRecord,
    accessToken: null | string,
    validations: null | { [key: string]: string[] },
  ) {
    this.success = code >= 200 && code < 300 ? true : false;
    this.code = code;
    this.msg = msg;
    this.title = title;
    this.authRecord = authRecord;
    this.accessToken = accessToken;
    this.validations = validations;
  }

  public getCode(): number {
    return this.code;
  }

  public getError(): ErrorResult {
    return new ErrorResult(this.code, this.msg, this.title, this.validations);
  }
}

class TaskResult {
  public success: boolean;
  public code: number;
  public title: string;
  public msg: string;
  public data: null | { [key: string]: any };
  public validations: null | { [key: string]: string[] };

  constructor(
    code: number,
    title: string,
    msg: string,
    data: null | { [key: string]: any },
    validations: null | { [key: string]: string[] },
  ) {
    this.success = code >= 200 && code < 300 ? true : false;
    this.code = code;
    this.msg = msg;
    this.title = title;
    this.data = data;
    this.validations = validations;
  }

  public getCode(): number {
    return this.code;
  }

  public getError(): ErrorResult {
    return new ErrorResult(this.code, this.msg, this.title, this.validations);
  }
}

class QueryResult {
  public success: boolean;
  public code: number;
  public title: string;
  public msg: string;
  public records: null | RecordEntry[];
  public validations: null | { [key: string]: string[] };

  constructor(
    code: number,
    title: string,
    msg: string,
    records: null | RecordEntry[],
    validations: null | { [key: string]: string[] },
  ) {
    this.success = code >= 200 && code < 300 ? true : false;
    this.code = code;
    this.title = title;
    this.msg = msg;
    this.records = records;
    this.validations = validations;
  }

  public getCode(): number {
    return this.code;
  }
}

class Payload {
  public data: { [key: string]: null | string | Blob | Blob[] };

  constructor(data: { [key: string]: null | string | Blob | Blob[] }) {
    this.data = data;
  }

  public getFormData(): FormData {
    const formData = new FormData();
    Object.entries(this.data).map(([name, field]) => {
      name = `data.${name}`;
      switch (true) {
        case field === undefined:
          return;
        case field === null:
        case field instanceof Array && !field.length:
          formData.append(name, '');
          return;
        case field instanceof Array:
          (field as Array<Blob>).map((file) => formData.append(`${name}[]`, file));
          return;
        default:
          formData.append(name, field as string | Blob);
      }
    });
    return formData;
  }
}

class Query<FilterType> extends Command {
  public type: 'flist' | 'plist' | 'slist';
  public list: string;
  public filters: FilterType;

  constructor(
    type: 'flist' | 'plist' | 'slist',
    authRecord: null | AuthRecord,
    artifacts: Artifacts,
    role: null | string,
    repository: string,
    list: string,
    filters: FilterType,
  ) {
    super(authRecord, artifacts, role, repository);
    this.type = type;
    this.list = list;
    this.filters = filters;
  }
}

class Retrieve {
  public authRecord: null | AuthRecord;
  public role: null | string;
  public repository: string;
  public uuid: string;
  public variant: null | string;

  constructor(
    authRecord: null | AuthRecord,
    role: null | string,
    repository: string,
    uuid: string,
    variant: null | string = null,
  ) {
    this.authRecord = authRecord;
    this.role = role;
    this.repository = repository;
    this.uuid = uuid;
    this.variant = variant;
  }
}

class FlistQuery extends Query<null | FlistFilters> {
  constructor(
    authRecord: null | AuthRecord,
    artifacts: Artifacts,
    role: null | string,
    repository: string,
    list: string,
    filters: null | FlistFilters,
    variant: null | string,
  ) {
    if (!(filters instanceof FlistFilters) && filters !== null) {
      throw new Error('something went wrong - bad flist filters');
    }
    super('flist', authRecord, artifacts, role, repository, list, filters);
  }
}

class PlistQuery extends Query<null | PlistFilters> {
  constructor(
    authRecord: null | AuthRecord,
    artifacts: Artifacts,
    role: null | string,
    repository: string,
    list: string,
    filters: null | PlistFilters,
    variant: null | string,
  ) {
    if (!(filters instanceof PlistFilters) && filters !== null) {
      throw new Error('something went wrong - bad plist filters');
    }
    super('plist', authRecord, artifacts, role, repository, list, filters);
  }
}

class SlistQuery extends Query<null | SlistFilters> {
  constructor(
    authRecord: null | AuthRecord,
    artifacts: Artifacts,
    role: null | string,
    repository: string,
    list: string,
    filters: null | SlistFilters,
    variant: null | string,
  ) {
    if (!(filters instanceof SlistFilters) && filters !== null) {
      throw new Error('something went wrong - bad slist filters');
    }
    super('slist', authRecord, artifacts, role, repository, list, filters);
  }
}

abstract class QueryFilters {
  //
}

class FlistFilters extends QueryFilters {
  where: { [key: string]: string | number };
  limit: number;

  constructor(where: { [key: string]: string | number }, limit: number) {
    super();
    this.where = where;
    this.limit = limit;
  }
}

class PlistFilters extends QueryFilters {
  where: { [key: string]: string | number };
  page: number;
  perPage: number;

  constructor(where: { [key: string]: string | number }, page: number, perPage: number) {
    super();
    this.where = where;
    this.page = page;
    this.perPage = perPage;
  }
}

class SlistFilters extends QueryFilters {
  where: { [key: string]: string | number };
  batchSize: number;

  constructor(where: { [key: string]: string | number }, batchSize: number) {
    super();
    this.where = where;
    this.batchSize = batchSize;
  }
}

//

abstract class RequestAbortHandlerAbstract {
  protected aborts: (() => void)[];

  constructor() {
    this.aborts = [];
  }

  abstract abort(): void;
  abstract register(abort: () => void): void;
  abstract clear(): void;
}

type RetrieveAction = (
  props: { [key: string]: any },
  requestAbortHandler: RequestAbortHandlerAbstract,
) => Promise<RetrieveResult>;

type QueryAction = (
  props: { [key: string]: any },
  requestAbortHandler: RequestAbortHandlerAbstract,
) => Promise<QueryResult>;

//

class ActionConclusion<T = any> {
  protected _result: CommandResult | QueryResult | AuthResult | TaskResult;
  protected notification: Notification;
  protected pushRoute: (to: string, goTop?: boolean) => void;
  constructor(
    result: CommandResult | QueryResult | AuthResult | TaskResult,
    notification: Notification,
    pushRoute: (to: string, goTop?: boolean) => void,
  ) {
    this._result = result;
    this.notification = notification;
    this.pushRoute = pushRoute;
  }
  public result(): CommandResult | QueryResult | AuthResult | TaskResult {
    return this._result;
  }
  public commandResult(): CommandResult {
    if (!(this._result instanceof CommandResult)) {
      throw new Error('command result is corrupt');
    }
    return this._result;
  }
  public queryResult(): QueryResult {
    if (!(this._result instanceof QueryResult)) {
      throw new Error('query result is corrupt');
    }
    return this._result;
  }
  public authResult(): AuthResult {
    if (!(this._result instanceof AuthResult)) {
      throw new Error('query result is corrupt');
    }
    return this._result;
  }
  public taskResult(): TaskResult {
    if (!(this._result instanceof TaskResult)) {
      throw new Error('query result is corrupt');
    }
    return this._result;
  }
  public async notify(nextRoute: null | string = null): Promise<void> {
    await this.notification.process(this._result);
    if (!nextRoute) {
      return;
    }
    this.pushRoute(nextRoute);
  }
  public xnotify(): Promise<SweetAlertResult<Awaited<T>>> {
    return this.notification.process(this._result);
  }
  public successful(): boolean {
    return this._result.success;
  }
}

//

export {
  Command,
  ErrorResult,
  MsgResult,
  CommandResult,
  RetrieveResult,
  QueryResult,
  AuthResult,
  TaskResult,
  Payload,
  Retrieve,
  FlistQuery,
  PlistQuery,
  SlistQuery,
  QueryFilters,
  FlistFilters,
  PlistFilters,
  SlistFilters,
  RequestAbortHandlerAbstract,
  ActionConclusion,
};
export type { RetrieveAction, QueryAction };
export { Model as DbModel } from 'mongoose';
