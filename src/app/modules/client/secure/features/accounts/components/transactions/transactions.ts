import { Component, input } from '@angular/core';
import { Account, AccountTransaction } from '../../models';
import { TransactionsContainer } from "@shared/components/transactions-container/transactions-container";
import { BaseGoal } from '@core/models/base-goal.model';
import { TransactionDependencies } from '@core/models/dependencies.model';

@Component({
  selector: 'app-account-transactions',
  imports: [TransactionsContainer],
  template: `
    <div class="section-transactions">
      <app-transactions-container [transactions]="transactions()" [isLoading]="isLoading()" [dependencies]="dependencies()"></app-transactions-container>
    </div>
  `,
  styles: ``
})
export class Transactions {
  isLoading = input.required<boolean>();
  dependencies = input.required<TransactionDependencies>();
  transactions = input.required<AccountTransaction[]>();
}
