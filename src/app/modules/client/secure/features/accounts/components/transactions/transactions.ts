import { Component, input } from '@angular/core';
import { TransactionsContainer } from "@shared/components/transactions-container/transactions-container";
import { AccountTransaction } from '../../models';

@Component({
  selector: 'app-account-transactions',
  imports: [TransactionsContainer],
  template: `
    <div class="section-transactions">
      <app-transactions-container [transactions]="transactions()" [isLoading]="isLoading()"></app-transactions-container>
    </div>
  `,
  styles: ``
})
export class Transactions {
  isLoading = input.required<boolean>();
  transactions = input.required<AccountTransaction[]>();
}
