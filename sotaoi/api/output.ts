import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { Helper } from '@sotaoi/api/helper';
import { BaseInput, FormValidations } from '@sotaoi/omni/input';
import {
  CommandResult,
  FlistQuery,
  PlistQuery,
  SlistQuery,
  QueryResult,
  FlistFilters,
  PlistFilters,
  SlistFilters,
  Retrieve,
} from '@sotaoi/omni/transactions';
import { Artifacts } from '@sotaoi/omni/artifacts';
import { Setup } from '@sotaoi/api/setup';
import _ from 'lodash';
import { app } from '@sotaoi/api/app-kernel';
import { Logger } from '@sotaoi/api/contracts';
import { InputValidator } from '@sotaoi/api/contracts';
import { StoreCommand, UpdateCommand, AuthCommand, TaskCommand } from '@sotaoi/api/commands';
import { StoreHandler } from '@sotaoi/api/commands/store-handler';
import { UpdateHandler } from '@sotaoi/api/commands/update-handler';
import { AuthHandler } from '@sotaoi/api/commands/auth-handler';
import { Output as OmniOutput } from '@sotaoi/omni/output';
import { TaskHandler } from '@sotaoi/api/commands/task-handler';

class Output extends OmniOutput {
  protected static registeredInputs: typeof BaseInput[] = [];

  public static registerInput(input: any): void {
    this.registeredInputs.push(input);
  }

  public static deserializePayload(fieldPayload: any): null | BaseInput<any, any> {
    if (typeof fieldPayload === 'undefined') {
      throw new Error('[ParseCommand]: field is missing in init, although it is found in validations');
    }

    if (fieldPayload === '' || fieldPayload === null) {
      return null;
    }

    const payloadJson: { [key: string]: any } =
      typeof fieldPayload === 'string'
        ? JSON.parse(fieldPayload)
        : typeof fieldPayload === 'object'
        ? fieldPayload
        : {};
    for (const registeredInput of this.registeredInputs) {
      const instance: BaseInput<any, any> = new (registeredInput as any)(null);
      if (instance.deserializeCondition(fieldPayload, payloadJson)) {
        return instance.deserialize(fieldPayload);
      }
    }

    throw new Error('unknown field payload type');
  }

  public static parseApiPayload(
    payload: { [key: string]: any },
    form: FormValidations,
    tlPrefix: string,
    isUpdateCommand: boolean,
  ): { [key: string]: any } {
    isUpdateCommand = isUpdateCommand && this.ALLOW_SKIP_UNCHANGED;

    return Helper.iterate(Helper.clone(form), tlPrefix, (item, prefix, transformer, prop) => {
      const key = prefix ? `${prefix}.${prop}` : prop;
      let nextKey = '';

      if (!(item instanceof Array)) {
        const collectionPayload = _.get(payload, key);
        const collectionValidations = item.fields;
        let newItem: { [key: string]: any } = {};
        switch (true) {
          case typeof collectionPayload === 'undefined' && isUpdateCommand:
            return {
              type: 'undefined',
              payload: null,
            };
          // multi collection
          case collectionPayload instanceof Array:
            newItem = {
              type: 'collection',
              min: item.min,
              max: item.max,
              fields: [],
            };
            Object.keys(collectionPayload).map((index) => {
              nextKey = `${key}.${index.toString()}`;
              newItem.fields.push(this.parseApiPayload(payload, collectionValidations, nextKey, isUpdateCommand));
            });
            return newItem;
          // single collection
          case typeof collectionPayload === 'object':
            nextKey = `${key}`;
            newItem = {
              type: 'singleCollection',
              fields: this.parseApiPayload(payload, collectionValidations, nextKey, isUpdateCommand),
            };
            return newItem;
          default:
            throw new Error('something went wrong parsing the api payload');
        }
      }

      if (isUpdateCommand && typeof _.get(payload, key) === 'undefined') {
        return {
          type: 'undefined',
          payload: null,
        };
      }
      const deserializedPayload = this.deserializePayload(_.get(payload, key));

      return {
        type: 'field',
        payload: deserializedPayload,
      };
    });
  }

  public static async runCommand(
    type: 'store' | 'update' | 'remove' | 'auth' | 'task',
    request: Request,
    handler: ResponseToolkit,
    logger: () => Logger,
  ): Promise<ResponseObject> {
    if (!(request.payload instanceof Object)) {
      throw new Error('something went wrong');
    }
    let payload: { [key: string]: any };
    const {
      accessToken,
      artifacts,
      role,
      repository,
      uuid = null,
      strategy = null,
      task = null,
      ...formData
    } = request.payload as {
      [key: string]: any;
    };

    const [authRecord] = await AuthHandler.translateAccessToken(handler, accessToken);

    let storeCommand: StoreCommand;
    let storeHandler: StoreHandler;
    let updateCommand: UpdateCommand;
    let updateHandler: UpdateHandler;
    let authCommand: AuthCommand;
    let authHandler: AuthHandler;
    let taskCommand: TaskCommand;
    let taskHandler: TaskHandler;
    let output: (payload: { [key: string]: any }) => Promise<CommandResult>;
    let formId: string;
    switch (true) {
      case type === 'store':
        storeHandler = Setup.getStoreHandler(repository, handler);
        formId = await storeHandler.getFormId();
        output = async (payload: { [key: string]: any }): Promise<CommandResult> => {
          storeCommand = new StoreCommand(authRecord, new Artifacts(artifacts), role, repository, payload);
          return this.parseCommand(await storeHandler.handle(storeCommand));
        };
        break;
      case type === 'update':
        if (!uuid) {
          throw new Error('something went wrong - update command has no uuid');
        }
        updateHandler = Setup.getUpdateHandler(repository, handler);
        formId = await updateHandler.getFormId();
        output = async (payload: { [key: string]: any }): Promise<CommandResult> => {
          updateCommand = new UpdateCommand(authRecord, new Artifacts(artifacts), role, repository, uuid, payload);
          return this.parseCommand(await updateHandler.handle(updateCommand));
        };
        break;
      case type === 'remove':
        throw new Error('remove not yet implemented');
      case type === 'auth':
        authHandler = Setup.getAuthHandler(repository, handler);
        formId = await authHandler.getFormId();
        output = async (payload: { [key: string]: any }): Promise<CommandResult> => {
          authCommand = new AuthCommand(new Artifacts(artifacts), repository, payload, strategy);
          return this.parseCommand(await authHandler.handle(authCommand));
        };
        break;
      case type === 'task':
        taskHandler = Setup.getTaskHandler(repository, task, handler);
        formId = await taskHandler.getFormId();
        output = async (payload: { [key: string]: any }): Promise<CommandResult> => {
          taskCommand = new TaskCommand(authRecord, new Artifacts(artifacts), role, repository, task, payload);
          return this.parseCommand(await taskHandler.handle(taskCommand));
        };
        break;
      default:
        throw new Error('failed to run command');
    }

    const form = Setup.getForm(repository, formId);
    payload = this.parseApiPayload(
      Helper.unflatten(formData).data,
      form,
      '',
      type === 'update' && this.ALLOW_SKIP_UNCHANGED,
    );

    const inputValidator = app()
      .get<InputValidator<(key: string) => void | null | BaseInput<any, any>>>(InputValidator)
      .getFormValidation((key: string) => _.get(payload, key).payload);
    await inputValidator.validatePayload(payload, form, '', type === 'update');

    const validationResult = inputValidator.getResult();
    if (!validationResult.valid) {
      const code = 422;
      const commandResult = new CommandResult(false, null, {
        code,
        title: validationResult.title,
        msg: validationResult.message,
        validations: validationResult.validations,
      });
      return handler.response(commandResult).code(code);
    }

    const cleanupUndefined: (() => void)[] = [];
    Helper.iterate(payload, '', (item, prefix, transformer, prop) => {
      let newItem: any;
      switch (true) {
        case item.type === 'collection':
          newItem = [];
          item.fields.map((field: any) => newItem.push(transformer(field, prefix, transformer, prop)));
          return newItem;
        case item.type === 'singleCollection':
          return transformer(item.fields, prefix, transformer, prop);
        case item.type === 'field':
          return item.payload;
        case type === 'update' && item.type === 'undefined':
          cleanupUndefined.push(() => _.unset(payload, prefix && prop ? `${prefix}.${prop}` : prefix || prop));
          return;
        default:
          return Helper.iterate(item, prefix && prop ? `${prefix}.${prop}` : prefix || prop, transformer);
      }
    });
    cleanupUndefined.map((fn) => fn());

    const result = await output(payload);
    return handler.response(result).code(result.getCode());
  }

  public static async runQuery(
    request: Request,
    handler: ResponseToolkit,
    logger: () => Logger,
  ): Promise<ResponseObject> {
    let flistQuery: FlistQuery;
    let plistQuery: PlistQuery;
    let slistQuery: SlistQuery;
    let output: QueryResult;
    const query = request.payload as { [key: string]: any };
    query.filters = query.filters ? JSON.parse(query.filters) : null;
    const queryHandler = Setup.getQueryHandler(query.repository, query.list, handler);
    const [authRecord] = await AuthHandler.translateAccessToken(handler, query.accessToken);
    switch (true) {
      case query.type === 'flist':
        flistQuery = new FlistQuery(
          authRecord,
          query.artifacts,
          query.role,
          query.repository,
          query.list,
          query.filters ? new FlistFilters(query.filters.where, query.filters.limit) : null,
        );

        output = await queryHandler.handle(flistQuery);
        break;
      case query.type === 'plist':
        plistQuery = new PlistQuery(
          authRecord,
          query.artifacts,
          query.role,
          query.repository,
          query.list,
          query.filters ? new PlistFilters(query.filters.where, query.filters.page, query.filters.perPage) : null,
        );
        output = await queryHandler.handle(plistQuery);
        break;
      case query.type === 'slist':
        slistQuery = new SlistQuery(
          authRecord,
          query.artifacts,
          query.role,
          query.repository,
          query.list,
          query.filters ? new SlistFilters(query.filters.where, query.filters.batchSize) : null,
        );
        output = await queryHandler.handle(slistQuery);
        break;
      default:
        throw new Error('failed to run query - unknown list type');
    }
    return handler.response(output).code(output.getCode());
  }

  public static async runRetrieve(
    request: Request,
    handler: ResponseToolkit,
    logger: () => Logger,
  ): Promise<ResponseObject> {
    const payload = request.payload as { [key: string]: any };
    const [authRecord] = await AuthHandler.translateAccessToken(handler, payload.accessToken);
    const retrieve = new Retrieve(
      authRecord,
      payload.role || null,
      payload.repository,
      payload.uuid,
      payload.variant || null,
    );
    const retrieveHandler = Setup.getRetrieveHandler(retrieve.repository, handler);
    const output = await retrieveHandler.handle(retrieve);
    return handler.response(output).code(output.getCode());
  }

  // runAuth

  // runTask
}

export { Output };
