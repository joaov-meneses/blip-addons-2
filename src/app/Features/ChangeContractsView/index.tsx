import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseFeature } from '@features/BaseFeature';
import { Filter } from './Filter';
import {
  CONTRACT_LIST_CLASS_IDENTIFIER,
  CONTRACTS_DIVISOR_CLASS_IDENTIFIER,
  CONTRACTS_FILTER_CLASS_IDENTIFIER,
  MAX_HEIGHT,
  MORE_CONTRACT_BUTTON_IDENTIFIER,
  ORGANIZATION_CLASS_IDENTIFIER,
  SHARED_WITH_ME_IDENTIFIER,
} from './Constants';

export class ChangeContractsView extends BaseFeature {
  public static shouldAlwaysClean = true;

  public handle(): void {
    this.runFunctionality();
  }

  public cleanup(): void {
    this.runFunctionality();
  }

  public runFunctionality(): any {
    const button = this.getMoreContractsButton();

    if (button) {
      button.click();
      const contractListContainer = this.getContractList();

      if (contractListContainer) {
        contractListContainer.style.maxHeight = MAX_HEIGHT;
      }

      if (!this.hasContractFilter) {
        this.createFilterElement();
      }

      this.cleanContractsEnvironment();
    }
  }

  private getMoreContractsButton(): HTMLElement {
    const button = document.querySelector(
      MORE_CONTRACT_BUTTON_IDENTIFIER
    ) as HTMLButtonElement;

    return button;
  }

  private getContractList(): HTMLElement {
    const tenantList = document.querySelector(
      CONTRACT_LIST_CLASS_IDENTIFIER
    ) as HTMLAreaElement;
    return tenantList;
  }

  private getOrganizationClassArea(): HTMLElement {
    const contractsHeaderIdentifier = document.querySelector(
      ORGANIZATION_CLASS_IDENTIFIER
    ) as HTMLAreaElement;
    return contractsHeaderIdentifier;
  }

  private getContractsAllDivisorArea(): HTMLElement[] {
    const divisors = Array.from(
      document.querySelectorAll(CONTRACTS_DIVISOR_CLASS_IDENTIFIER)
    ) as HTMLAreaElement[];

    return divisors || [];
  }

  public get hasContractFilter(): boolean {
    return !!document.getElementById(CONTRACTS_FILTER_CLASS_IDENTIFIER);
  }

  private filterContract = (event: any): void => {
    const inputValue = event.target.value;

    const contractListContainer = this.getContractList();

    const listItems = contractListContainer.children;

    const listItemsArray = Array.from(listItems) as HTMLElement[];

    listItemsArray.forEach((everyContract) => {
      everyContract.style.display = 'block';
    });

    const checkedAndNormalizedInput = inputValue.toLowerCase() || '';

    if (checkedAndNormalizedInput) {
      listItemsArray.forEach((everyContract) => {
        const contractTextData = everyContract.textContent.toLowerCase();

        const inputMatchWithContractText = contractTextData.includes(
          checkedAndNormalizedInput
        );

        if (!inputMatchWithContractText) {
          everyContract.style.display = 'none';
        }
      });
    }
  };

  private createFilterElement = (): void => {
    const filter = document.createElement('div');

    filter.id = CONTRACTS_FILTER_CLASS_IDENTIFIER;

    ReactDOM.render(<Filter onChange={this.filterContract} />, filter);

    const contractsHeaderIdentifier = this.getOrganizationClassArea();

    contractsHeaderIdentifier.prepend(filter);
  };

  private cleanContractsEnvironment = (): void => {
    const contractListContainer = this.getContractList();

    if (contractListContainer) {
      const divisors = this.getContractsAllDivisorArea();

      divisors.forEach((everyDivisor) => {
        everyDivisor.style.display = 'none';
      });
    }
  };
}
