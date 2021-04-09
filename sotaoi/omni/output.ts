import _ from 'lodash';
import { CommandResult, AuthResult, TaskResult } from '@sotaoi/omni/transactions';

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
        case typeof output.code !== 'number':
        case typeof output.title !== 'string':
        case typeof output.msg !== 'string':
        case typeof output.data === 'undefined':
        case typeof output.validations === 'undefined':
          throw new Error('bad auth output');
        default:
          return new TaskResult(output.code, output.title, output.msg, output.data || null, output.validations || null);
      }
    } catch (err) {
      return new TaskResult(
        400,
        err && err.name ? err.name : 'Error',
        err && err.message ? err.message : 'Something went wrong',
        null,
        null,
      );
    }
  }
}

export { Output };
