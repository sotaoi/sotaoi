import { Artifacts, AuthRecord, RecordRef, RecordEntry } from '@sotaoi/omni/artifacts';
import Joi from 'joi';

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

abstract class BaseCommandResult {
  public success: boolean;
  public result: null | CommandResultSuccess | AuthResultSuccess | TaskResultSuccess;
  public error: null | ErrorResult;

  constructor(
    success: boolean,
    result: null | CommandResultSuccess | AuthResultSuccess | TaskResultSuccess,
    error: null | ErrorResult,
  ) {
    this.success = success;
    this.result = result;
    this.error = error;
  }

  public getCode(): number {
    if (typeof this.result?.code !== 'number' && typeof this.error?.code !== 'number') {
      throw new Error('something went wrong');
    }
    return (this.result?.code || this.error?.code) as number;
  }

  public getError(): ErrorResult {
    if (!this.error) {
      throw new Error('failed to get error, error is null');
    }
    return this.error;
  }
}

class CommandResultSuccess {
  code: number;
  title: string;
  msg: string;
  ref: null | RecordRef;

  constructor(result: { code: number; title: string; msg: string; ref: null | RecordRef }) {
    if (result.ref !== null && !(result.ref instanceof RecordRef)) {
      throw new Error('something went wrong, result.ref should be null or RecordRef');
    }
    Joi.object({ code: Joi.number(), title: Joi.string(), msg: Joi.string(), ref: Joi.any() }).validate(result);
    this.code = result.code;
    this.title = result.title;
    this.msg = result.msg;
    this.ref = result.ref;
  }
}
class CommandResult extends BaseCommandResult {
  public result: null | CommandResultSuccess;

  constructor(success: boolean, result: null | CommandResultSuccess, error: null | ErrorResult) {
    super(success, result, error);
    this.result = result;
  }
}

interface RetrieveResultInterface {
  code: number;
  title: string;
  msg: string;
  record: RecordEntry;
}
class RetrieveResult {
  success: boolean;
  result: null | RetrieveResultInterface;
  error: null | ErrorResult;

  constructor(success: boolean, result: null | RetrieveResultInterface, error: null | ErrorResult) {
    this.success = success;
    this.result = result;
    this.error = error;
  }

  public getCode(): number {
    if (typeof this.result?.code !== 'number' && typeof this.error?.code !== 'number') {
      throw new Error('something went wrong');
    }
    return (this.result?.code || this.error?.code) as number;
  }
}

class AuthResultSuccess {
  code: number;
  title: string;
  msg: string;
  authRecord: AuthRecord;

  constructor(result: { code: number; title: string; msg: string; authRecord: AuthRecord }) {
    if (result.authRecord !== null && !(result.authRecord instanceof AuthRecord)) {
      throw new Error('something went wrong, result.authRecord should be null or AuthRecord');
    }
    Joi.object({ code: Joi.number(), title: Joi.string(), msg: Joi.string(), authRecord: Joi.any() }).validate(result);
    this.code = result.code;
    this.title = result.title;
    this.msg = result.msg;
    this.authRecord = result.authRecord;
  }
}
class AuthResult extends BaseCommandResult {
  result: null | AuthResultSuccess;

  constructor(success: boolean, result: null | AuthResultSuccess, error: null | ErrorResult) {
    super(success, result, error);
    this.result = result;
  }

  public getCode(): number {
    if (typeof this.result?.code !== 'number' && typeof this.error?.code !== 'number') {
      throw new Error('something went wrong');
    }
    return (this.result?.code || this.error?.code) as number;
  }

  public getError(): ErrorResult {
    if (!this.error) {
      throw new Error('failed to get error, error is null');
    }
    return this.error;
  }
}

class TaskResultSuccess {
  code: number;
  title: string;
  msg: string;
  data: null | { [key: string]: any };

  constructor(result: { code: number; title: string; msg: string; data: null | { [key: string]: any } }) {
    if (result.data !== null && !(result.data instanceof Object)) {
      throw new Error('something went wrong, result.data should be null or Object');
    }
    Joi.object({ code: Joi.number(), title: Joi.string(), msg: Joi.string(), data: Joi.any() });
    this.code = result.code;
    this.title = result.title;
    this.msg = result.msg;
    this.data = result.data;
  }
}
class TaskResult extends BaseCommandResult {
  result: null | TaskResultSuccess;

  constructor(success: boolean, result: null | TaskResultSuccess, error: null | ErrorResult) {
    super(success, result, error);
    this.result = result;
  }

  public getCode(): number {
    if (typeof this.result?.code !== 'number' && typeof this.error?.code !== 'number') {
      throw new Error('something went wrong');
    }
    return (this.result?.code || this.error?.code) as number;
  }
}

interface QueryResultInterface {
  code: number;
  title: string;
  msg: string;
  records: RecordEntry[];
}
class QueryResult {
  success: boolean;
  result: null | QueryResultInterface;
  error: null | ErrorResult;

  constructor(success: boolean, result: null | QueryResultInterface, error: null | ErrorResult) {
    this.success = success;
    this.result = result;
    this.error = error;
  }

  public getCode(): number {
    if (typeof this.result?.code !== 'number' && typeof this.error?.code !== 'number') {
      throw new Error('something went wrong');
    }
    return (this.result?.code || this.error?.code) as number;
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

export {
  Command,
  ErrorResult,
  MsgResult,
  CommandResult,
  CommandResultSuccess,
  RetrieveResult,
  QueryResult,
  AuthResult,
  AuthResultSuccess,
  TaskResult,
  TaskResultSuccess,
  Payload,
  Retrieve,
  FlistQuery,
  PlistQuery,
  SlistQuery,
  QueryFilters,
  FlistFilters,
  PlistFilters,
  SlistFilters,
};
export type { QueryBuilder } from 'knex';
