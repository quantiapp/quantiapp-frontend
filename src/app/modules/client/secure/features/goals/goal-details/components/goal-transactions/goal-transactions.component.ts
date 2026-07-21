import { Component, input } from '@angular/core';
import { BaseTransaction } from '@core/models/base-transaction.model';
import { TransactionsContainer } from "@shared/components/transactions-container/transactions-container";

@Component({
  selector: 'app-goal-transactions',
  imports: [TransactionsContainer],
  template: `
    <div class="section-transactions">
      <app-transactions-container [transactions]="transactions()" [isLoading]="isLoading()"></app-transactions-container>
    </div>
  `,
  styles: ``
})
export class GoalTransactionsComponent {
  isLoading = input.required<boolean>();
  transactions = input.required<BaseTransaction[]>();
}
