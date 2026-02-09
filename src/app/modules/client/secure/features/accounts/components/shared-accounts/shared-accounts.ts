import { Component, input, output } from '@angular/core';
import { AccountsContainer } from "@shared/components/accounts-container/accounts-container";
import { Darkable } from "@shared/directives/darkable";
import { AccountViewModel } from '../../models';

@Component({
  selector: 'app-shared-accounts',
  imports: [AccountsContainer, Darkable],
  template: `
    <div class="section-my-accounts">
      <app-accounts-container [accounts]="this.accounts()" [isLoading]="this.isLoading()">
        <ng-container header>
          <h3 class="text-base text-(color:--secondary) font-medium" appDarkable="dark:text-(color:--dm-secondary)">Partilhadas consigo</h3>
        </ng-container>
      </app-accounts-container>
    </div>
  `,
  styles: ``
})
export class SharedAccounts {
  accounts = input.required<AccountViewModel[]>();
  activeAccountEmitter = output<number>();
  isLoading = input.required<boolean>();
}
