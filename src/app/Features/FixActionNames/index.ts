import { BaseFeature } from '../BaseFeature';
import { getController } from '~/Utils';
import { ActionNameRule, ActionNamePlan, applyActionNames, planActionNames } from './rules';

export class FixActionNames extends BaseFeature {
  public static isUserTriggered = true;

  public handle(rules: ActionNameRule[], simplifyVariables = true, preview = false): ActionNamePlan {
    const controller = getController();
    if (!controller?.flow || controller.isLoading) throw new Error('flow-unavailable');
    const plan = preview
      ? planActionNames(controller.flow, rules, simplifyVariables)
      : applyActionNames(controller.flow, rules, simplifyVariables);
    // React events run outside AngularJS. Refresh bindings using the existing scope.
    if (!preview && plan.changes.length) controller.$scope?.$evalAsync?.();
    return plan;
  }
}
