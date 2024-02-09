import { Format } from 'logform';
import winston from 'winston';
import moment from 'moment-timezone'
import { DateTime } from "luxon";

import 'dotenv/config'


const { label, printf } = winston.format;
class Logs {

  private formatDefault: Format;
  private formatFile: Format;
  private formatConsole: Format;

  private logOptionsFile: winston.transports.FileTransportOptions;
  private logOptionsConsole: winston.transports.ConsoleTransportOptions;

  // private colorizer = winston.format.colorize();

  private logger: winston.Logger | null = null;


  constructor() {
    this.formatDefault = winston.format.combine(
      winston.format.colorize(),
    );

    let d = DateTime.local();
    let zoneName = d.zoneName;
    const myFormat = printf((info: any) => `${info.timestamp}  [${info.level}]: ${info.label} - ${info.message}`);

    const appendTimestamp = winston.format((info: any, opts: any) => {
      if (opts.tz)
        info.timestamp = moment().tz(opts.tz).format();
      return info;
    });

    this.formatFile = winston.format.combine(
      label({ label: 'main' }),
      appendTimestamp({ tz: `${zoneName}` }),
      myFormat
    );


    // The formatter used for the console transport
    this.formatConsole = winston.format.combine(
      label({ label: 'main' }),
      appendTimestamp({ tz: `${zoneName}` }),
      myFormat,

    );

    // The file transport options
    this.logOptionsFile = {
      filename: `${process.env.LOG_FILE || '/api-server.log'}`,
      format: this.formatFile,
      handleExceptions: true,
      level: `${process.env.LOG_FILE_LEVEL || 'info'}`,
      maxFiles: 5,
      maxsize: 524288000,
      tailable: true
    };


    // The console transport options
    this.logOptionsConsole = {
      format: this.formatConsole,
      handleExceptions: true,
      level: `${process.env.LOG_CONSOLE_LEVEL || 'silly'}`
    };

    const transports = [];

    // If the LOG_FILE  and LOG_FILE_LEVEL environment variables are set, create a transport for it.
    if (process.env.LOG_FILE != null && process.env.LOG_FILE_LEVEL != null) {
      transports.push(new winston.transports.File(this.logOptionsFile));
    }

    // If the LOG_CONSOLE_LEVEL environment variable is set, create a console transport.
    if (process.env.LOG_CONSOLE_LEVEL != null) {
      transports.push(new winston.transports.Console(this.logOptionsConsole));
    }

    // Only create the logger if at least one transport was created.
    if (transports.length > 0) {
      this.logger = winston.createLogger({
        exitOnError: false,
        format: this.formatDefault,
        levels: winston.config.npm.levels,
        transports
      });
    }

  }

  // This stream was added to support using the logger with Morgan.
  public stream() {
    return {
      write: (message: string) => {
        this.info(message.trim(), 'route');
      }
    };
  }

  public error(err: Error | string, category?: string): void {
    if (err != null) {
      if (err instanceof Error) {
        this.sendLog('error', err.toString(), category);
      }
      else if (typeof err === 'string') {
        this.sendLog('error', err, category);
      }
    }
  }

  public info(message: string, category?: string): void {
    const newmes = message.substring(27)
    this.sendLog('info', newmes, category);
  }

  public verbose(message: string, category?: string): void {
    this.sendLog('verbose', message, category);
  }

  public debug(message: string, category?: string): void {
    this.sendLog('debug', message, category);
  }

  private sendLog(level: string, message: string, category?: string): void {
    if (this.logger && message != null) {
      this.logger.log({ level, message, category: category || 'server' });
    }
  }

}

export const logger = new Logs();





