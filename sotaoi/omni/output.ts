import _ from 'lodash';
import { CommandResult, AuthResult, TaskResult, TaskResultSuccess } from '@sotaoi/omni/transactions';

class Output {
  public static readonly ALLOW_SKIP_UNCHANGED = false;

  public static parseCommand(output: { [key: string]: any }): CommandResult {
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.code !== 'number':
        case typeof output.title !== 'string':
        case typeof output.msg !== 'string':
        case typeof output.artifact === 'undefined':
        case typeof output.validations === 'undefined':
          throw new Error('bad command output');
        default:
          return new CommandResult(
            output.code,
            output.title,
            output.msg,
            output.artifact || null,
            output.validations || null,
          );
      }
    } catch (err) {
      return new CommandResult(
        400,
        err && err.name ? err.name : 'Error',
        err && err.message ? err.message : 'Something went wrong',
        null,
        null,
      );
    }
  }

  // parseQuery

  // parseRetrieve

  public static parseAuth(output: { [key: string]: any }): AuthResult {
    try {
      switch (true) {
        case typeof output !== 'object':
        case typeof output.code !== 'number':
        case typeof output.title !== 'string':
        case typeof output.msg !== 'string':
        case typeof output.authRecord === 'undefined':
        case typeof output.accessToken === 'undefined':
        case typeof output.validations === 'undefined':
          throw new Error('bad auth output');
        default:
          return new AuthResult(
            output.code,
            output.title,
            output.msg,
            output.authRecord || null,
            output.accessToken || null,
            output.validations || null,
          );
      }
    } catch (err) {
      return new AuthResult(
        400,
        err && err.name ? err.name : 'Error',
        err && err.message ? err.message : 'Something went wrong',
        null,
        null,
        null,
      );
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
          throw new Error('bad task output');
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
