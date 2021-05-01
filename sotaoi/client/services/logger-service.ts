import chalk from 'chalk';
import { Logger } from '@sotaoi/client/contracts';

const log = console.log;
const warn = console.warn;
const error = console.error;

class LoggerService extends Logger {
  public notice(...textArr: any[]): void {
    let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
    header = `[${header}] NOTICE:`;
    textArr.map((text) => {
      log(header, text, '\n');
    });
  }

  public info(...textArr: any[]): void {
    let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
    header = `[${header}] INFO:`;
    textArr.map((text) => {
      log(header, text, '\n');
    });
  }

  public warn(...textArr: any[]): void {
    let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
    header = `[${header}] WARNING:`;
    textArr.map((text) => {
      warn(chalk.yellow(header, text), '\n');
    });
  }

  public error(...textArr: any[]): void {
    let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
    header = `[${header}] ERROR:`;
    textArr.map((text) => {
      error(chalk.red(header, text), '\n');
    });
  }

  public estack(err: any): void {
    let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
    header = `[${header}] ERROR:`;
    error(chalk.red(header, err), '\n');
  }

  public wstack(err: any): void {
    let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
    header = `[${header}] WARNING:`;
    error(chalk.yellow(header, err), '\n');
  }
}

export { LoggerService };
