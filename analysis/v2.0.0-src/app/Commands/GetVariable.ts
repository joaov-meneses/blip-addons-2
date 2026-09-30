import { get } from 'dot-prop';

import { BaseCommand } from './BaseCommand';

/**
 * Gets a variable by its name
 *
 * @code `GET_VARIABLE`
 * @arg variableName The name of the variable to get
 */
export class GetVariable extends BaseCommand {
  /**
   * Obtains the canvas
   */
  private getCanvas(): Element {
    return document.querySelector('#canvas');
  }

  /**
   * Returns the value of the variable
   *
   * @param variableName The variable
   */
  public handle(variableName: string): unknown {
    const isReady = !!window.angular;

    if (isReady) {
      const canvas = this.getCanvas();
      const hasCanvas = !!this.getCanvas();

      if (hasCanvas) {
        const controller = window.angular.element(canvas).controller();

        return get(controller, variableName);
      }
    }

    return null;
  }
}
