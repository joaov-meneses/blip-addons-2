import { BaseFeature } from '../BaseFeature';

/**
 * This feature leaves the input in actions with the exact
 * same casing that the user typed.
 */
export class OriginalCaseInput extends BaseFeature {
  /**
   * Removes the 'ttu' class from all the inputs, thus
   * making the input display the original case
   */
  public handle(): void {
    const inputs = document.querySelectorAll('input.ttu');
    const listOfInputs = Array.from(inputs);

    for (const input of listOfInputs) {
      input.classList.remove('ttu');
    }
  }
}
