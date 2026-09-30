import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseFeature } from '@features/BaseFeature';
import * as Constants from './Constants';
import { Filter } from './Filter';
import { Settings } from '~/Settings';

const FILTER_ID = 'blip-addons-filter';
const FILTER_CONTAINER = '.chatbots-subheader .flex:last-child';

export class FilterBots extends BaseFeature {
  public static shouldAlwaysClean = true;

  private getHeader(): HTMLElement {
    const container = document.querySelector(FILTER_CONTAINER) as HTMLElement;

    return container;
  }

  public handle(): void {
    // ...
  }

  public get hasFilter(): boolean {
    return !!document.getElementById(FILTER_ID);
  }

  private get paintRoutersByAmbientIsActive(): boolean {
    return Settings.devMode.paintRoutersByAmbient;
  }

  public get allContacts(): HTMLElement[] {
    return Array.from(
      document.getElementsByTagName('contact')
    ) as HTMLElement[];
  }

  private matchesAny(source: string, patterns: RegExp[]): boolean {
    return patterns.some((pattern) => pattern.test(source));
  }

  private getRegexes(environment: keyof typeof Constants): RegExp[] {
    const keywordsMap = {
      [Constants.ALL]: [''],
      [Constants.PRD]: Settings.prodKey,
      [Constants.HMG]: Settings.hmgKey,
      [Constants.DEV]: Settings.devKey,
      [Constants.BETA]: Settings.betaKey,
    };

    return keywordsMap[environment]
      .map((keyword) => keyword.trim())
      .map((keyword) => new RegExp(`\\b${keyword}\\b`, 'i'));
  }

  private handleChange = (e: any): void => {
    const regexes = this.getRegexes(e.target.value);
    const contacts = this.allContacts;

    for (const contact of contacts) {
      const contactName = (
        contact.querySelector('.contact-name bds-typo, .contact-name span, .contact-name') as HTMLElement
      )?.textContent || '';

      contact.style.display = this.matchesAny(contactName, regexes)
        ? 'block'
        : 'none';
    }
  };

  private paintRouters(): void {
    const contacts = this.allContacts;

    for (const contact of contacts) {
      const contactCategory = contact.querySelector(
        '.contact-data bds-chip-tag'
      )?.innerHTML;

      const isRouter = contactCategory?.startsWith('R');

      if (isRouter) {
        const contactCard = contact.querySelector('.card') as HTMLElement;

        if (contactCard) {
          const contactNameElement =
            contact.querySelector('.contact-name' + ' bds-typo')?.innerHTML ||
            '';

          contactCard.style.backgroundColor =
            this.checkNewColor(contactNameElement);
        }
      }
    }
  }

  private checkNewColor(contactNameElement: string): string {
    if (this.paintRoutersByAmbientIsActive) {
      if (contactNameElement.includes('DEV')) {
        return Constants.COLORS.DEV;
      }
      if (contactNameElement.includes('HMG')) {
        return Constants.COLORS.HMG;
      }
      if (contactNameElement.includes('BETA')) {
        return Constants.COLORS.BETA;
      }
      if (contactNameElement.includes('PRD')) {
        return Constants.COLORS.PRD;
      }
    }

    return Constants.COLORS.DEFAULT;
  }

  public cleanup(): any {
    const header = this.getHeader();
    this.paintRouters();

    if (header) {
      if (!this.hasFilter) {
        const filter = document.createElement('div');

        filter.id = FILTER_ID;

        ReactDOM.render(<Filter onChange={this.handleChange} />, filter);
        header.appendChild(filter);
      }

      return true;
    }

    return false;
  }
}
