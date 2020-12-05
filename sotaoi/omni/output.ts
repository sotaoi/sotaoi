import _ from 'lodash';
import { CommandResult, AuthResult, TaskResult, TaskResultSuccess } from '@sotaoi/omni/transactions';

class Output {
  public static readonly ALLOW_SKIP_UNCHANGED = false;

  public static parseCommand(output: { [key: string]: any }): CommandResult {
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.success !== 'boolean':
        case typeof output.result === 'undefined':
        case typeof output.error === 'undefined':
        case output.result && output.error:
        case typeof output.result !== 'object' &&
          typeof output.error !== 'object' &&
          output.result !== null &&
          output.error !== null:
        case typeof output.result?.code !== 'number' && typeof output.error?.code !== 'number':
        case output.result !== null && output.error !== null:
          throw new Error('bad output');
        default:
          return new CommandResult(output.success, output.result, output.error);
      }
    } catch (err) {
      return new CommandResult(false, null, {
        code: 400,
        title: err && err.name ? err.name : 'Error',
        msg: err && err.message ? err.message : 'Something went wrong',
        validations: null,
      });
    }
  }

  // parseQuery

  // parseRetrieve

  public static parseAuth(output: { [key: string]: any }): AuthResult {
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.success !== 'boolean':
        case typeof output.result === 'undefined':
        case typeof output.error === 'undefined':
        case output.result && output.error:
        case typeof output.result !== 'object' &&
          typeof output.error !== 'object' &&
          output.result !== null &&
          output.error !== null:
        case typeof output.result?.code !== 'number' && typeof output.error?.code !== 'number':
        case output.result !== null && output.error !== null:
          throw new Error('bad output');
        default:
          return new AuthResult(output.success, output.result, output.error);
      }
    } catch (err) {
      return new AuthResult(false, null, {
        code: 400,
        title: err && err.name ? err.name : 'Error',
        msg: err && err.message ? err.message : 'Something went wrong',
        validations: null,
      });
    }
  }

  public static parseTask(output: { [key: string]: any }): TaskResult {
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.success !== 'boolean':
        case typeof output.result === 'undefined':
        case typeof output.error === 'undefined':
        case output.result && output.error:
        case typeof output.result !== 'object' &&
          typeof output.error !== 'object' &&
          output.result !== null &&
          output.error !== null:
        case typeof output.result?.code !== 'number' && typeof output.error?.code !== 'number':
        case output.result !== null && output.error !== null:
          throw new Error('bad output');
        default:
          output.result && (output.result = new TaskResultSuccess(output.result));
          return new TaskResult(output.success, output.result, output.error);
      }
    } catch (err) {
      return new TaskResult(false, null, {
        code: 400,
        title: err && err.name ? err.name : 'Error',
        msg: err && err.message ? err.message : 'Something went wrong',
        validations: null,
      });
    }
  }
}

export { Output };
