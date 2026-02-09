import { Component, input, output } from '@angular/core';
import { DashboardAccountViewModel } from '../../models';
import { AccountsContainer } from "@shared/components/accounts-container/accounts-container";

@Component({
  selector: 'app-dashboard-accounts',
  imports: [AccountsContainer],
  template: `
    <div class="section-accounts">
      <app-accounts-container [accounts]="this.accounts()" [isLoading]="this.isLoading()" (activeAccountEmitter)="this.updateActiveAccount($event)"></app-accounts-container>
    </div>
  `,
  styles: ``
})
export class AccountsComponent {
  accounts = input.required<DashboardAccountViewModel[]>();
  activeAccountEmitter = output<number>();
  isLoading = input.required<boolean>();

  updateActiveAccount(index: number): void {
    this.activeAccountEmitter.emit(index);
  }
}
