import { Component, computed, DestroyRef, effect, inject, untracked } from '@angular/core';
import { AccountGoalsComponent } from "./account-goals/account-goals.component";
import { AccountTransactionsComponent } from "./account-transactions/account-transactions.component";
import { DetailsFacade } from '../../details.facade';
import { TheAccount } from '../../details.page';
import { finalize, take } from 'rxjs';
import { FinanceStoreViewModel } from '@core/view-models/finance-store.viewmodel';
import { FinanceStore } from '@core/data/finance-store.data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-finances',
  imports: [AccountGoalsComponent, AccountTransactionsComponent],
  template: `
    <div class="finance-container flex flex-col gap-6">
      <div class="account-goals">
        <app-account-goals [isLoading]="isLoadingGoals()" [goals]="goals()"></app-account-goals>
      </div>
  
      <div class="account-transactions">
        <app-account-details-transactions [isLoading]="isLoadingTransactions()" [transactions]="transactions()"></app-account-details-transactions>
      </div>
    </div>
  `,
  styles: ``
})
export class FinancesComponent {
  private detailsFacade = inject(DetailsFacade);

  account = computed(() => this.detailsFacade.account());
  private financeStoreViewModel = inject(FinanceStoreViewModel);
  private financeStore = inject(FinanceStore);

  constructor(private destroyRef: DestroyRef) {
    effect(() => {

      const currentAccount = this.account();
      if(!currentAccount) return;

      untracked(() => {
        if(currentAccount.type === 'shared') {
          this.detailsFacade.isLoadingGoals.set(true);
          this.detailsFacade.getGoalsBySharedAccount(currentAccount.account.id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.detailsFacade.isLoadingGoals.set(false))).subscribe()
        }

        this.accountTransactions(currentAccount);
      });
    })
  }

  isLoadingGoals = this.detailsFacade.isLoadingGoals.asReadonly();
  isLoadingTransactions = this.detailsFacade.isLoadingTransactions.asReadonly();

  goals = computed(() => {
    const account = this.account();
      if(!account) return [];

      const accountId = account.account.id;

      return this.financeStoreViewModel.goalsByAccountIdMap()[accountId] || [];
  });
  transactions = computed(() => {
    const account = this.account();
    if(!account) return [];
    
    const accountId = account.account.id;
    return this.financeStore.transactionsByAccountIdMap()[accountId] ?? [];
  });

  accountTransactions(account: TheAccount) {
    this.detailsFacade.isLoadingTransactions.set(true);
    this.detailsFacade.getTransactionsByAccount(account.account.id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.detailsFacade.isLoadingTransactions.set(false)), take(1)).subscribe()
  }
}
