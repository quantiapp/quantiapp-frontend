import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { HeaderPartial } from "@core/partials/client/secure/header.partial";
import { MyAccounts } from "./components/my-accounts/my-accounts";
import { SharedAccounts } from "./components/shared-accounts/shared-accounts";
import { Transactions } from './components/transactions/transactions';
import { AccountTransaction, AccountViewModel } from './models';
import { FinanceStoreViewModel } from '@core/view-models/finance-store.viewmodel';
import { FinanceStore } from '@core/data/finance-store.data';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-card',
  imports: [HeaderPartial, MyAccounts, SharedAccounts, Transactions, Darkable],
  template: `
    <div class="section-container py-8 flex flex-col min-h-screen gap-6 limited-container">

      <section class="header">
        <app-header>
          <p class="text-sm font-medium" appDarkable="dark:text-(color:--dm-secondary)">
            O primeiro passo é o mais valioso
          </p>
        </app-header>
      </section>

      <section class="accounts">
        <app-my-accounts [isLoading]="isLoadingAccount()" [accounts]="accounts()" />
      </section>

      <section class="goals">
        <app-shared-accounts [isLoading]="isLoadingAccount()" [accounts]="sharedAccounts()" />
      </section>

      <section class="latest-transactions">
        <app-account-transactions [isLoading]="isLoadingTransactions()" [transactions]="transactions()" />
      </section>

    </div>
  `,
  styles: ``
})
export class AccountPage implements OnInit {
  isLoadingAccount = signal(false);
  isLoadingTransactions = signal(false);
  active = signal<{ index: number, account?: AccountViewModel }>({
    index: 0
  });
  private financeStoreViewModel = inject(FinanceStoreViewModel);
  private financeStore = inject(FinanceStore);

  accounts: Signal<AccountViewModel[]> = computed(() => this.financeStoreViewModel.accountsWithBalances());
  sharedAccounts: Signal<AccountViewModel[]> = computed(() => this.financeStoreViewModel.sharedAccounts());
  transactions: Signal<AccountTransaction[]> = computed(() => this.financeStore.latest_transactions());

  ngOnInit(): void {
    
  }

}
