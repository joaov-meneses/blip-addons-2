import { BaseFeature } from '@features/BaseFeature';

const ROUTER_SERVICES_PATH = 'template/master';
const LINKED_SERVICES_IDENTIFIER =
  'a[ui-sref="auth.application.detail.dashboard.general({shortName: $ctrl.application.shortName})"]';

const ANALYTICS_PATH = 'dashboard/general';
const BUILDER_PATH = 'templates/builder';

export class AddButtonToBuilder extends BaseFeature {
  public static shouldAlwaysClean = true;

  public get isOnRouterServicesPath(): boolean {
    return window.location.pathname.includes(ROUTER_SERVICES_PATH);
  }

  private getAllServicesLinked(): HTMLElement[] {
    const buttonsList = Array.from(
      document.querySelectorAll(LINKED_SERVICES_IDENTIFIER)
    ) as HTMLElement[];

    return buttonsList;
  }

  public handle(): void {
    // ...
  }

  public cleanup(): any {
    if (this.isOnRouterServicesPath) {
      const buttonsList = this.getAllServicesLinked();

      buttonsList.forEach((everyService) => {
        const currentHref = everyService.getAttribute('href');
        const newHref = currentHref.replace(ANALYTICS_PATH, BUILDER_PATH);
        everyService.setAttribute('href', newHref);
      });
    }
  }
}
