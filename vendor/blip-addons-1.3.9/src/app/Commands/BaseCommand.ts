import { v4 as uuid } from 'uuid';
import { constantCase } from 'constant-case';

import { BlipsRequest } from '../types';
import { Resolver } from '../Resolver';

export abstract class BaseCommand {
  /**
   * Indicates wether the command is ready
   */
  public static isReady = false;

  public constructor() {
    // ...
  }

  /**
   * The code of the command
   */
  public static get code(): string {
    return constantCase(this.name);
  }

  /**
   * Handles the command and evaluates the result
   */
  public abstract handle(...args: any[]): any | Promise<any>;

  /**
   * Executes the command
   */
  public static async execute(...args: any[]): Promise<unknown> {
    return new Promise((resolve) => {
      const identifier = uuid();

      Resolver.register(identifier, resolve);

      window.postMessage(
        {
          identifier,
          isBlipsRequest: true,
          commandCode: this.code,
          args,
        } as BlipsRequest,
        '*'
      );
    });
  }
}
