import { Component, input } from '@angular/core';
import { TransactionsContainer } from "@shared/components/transactions-container/transactions-container";
import { TransactionDependencies } from '@core/models/dependencies.model';
import { DashboardTransaction } from '../../models';

@Component({
  selector: 'app-dashboard-transactions',
  imports: [TransactionsContainer],
  template: `
    <div class="section-transactions">
      <app-transactions-container [transactions]="transactions()" [isLoading]="isLoading()"></app-transactions-container>
    </div>
  `,
  styles: ``
})
export class TransactionsComponent {
  isLoading = input.required<boolean>();
  transactions = input.required<DashboardTransaction[]>();
}
