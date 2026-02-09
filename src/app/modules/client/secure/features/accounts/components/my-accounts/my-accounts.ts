import { Component, input, output } from '@angular/core';
import { AccountsContainer } from "@shared/components/accounts-container/accounts-container";
import { AccountViewModel } from '../../models';

@Component({
  selector: 'app-my-accounts',
  imports: [AccountsContainer],
  template: `
    <div class="section-my-accounts">
      <app-accounts-container (activeAccountEmitter)="updateActiveAccount($event)" [accounts]="this.accounts()" [isLoading]="this.isLoading()"></app-accounts-container>
    </div>
  `,
  styles: ``
})
export class MyAccounts {
  accounts = input.required<AccountViewModel[]>();
  activeAccountEmitter = output<number>();
  isLoading = input.required<boolean>();

  updateActiveAccount(index: number): void {
    this.activeAccountEmitter.emit(index);
  }
}
