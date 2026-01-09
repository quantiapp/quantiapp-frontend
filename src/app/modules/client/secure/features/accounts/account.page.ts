import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderPartial } from "@core/partials/client/secure/header.partial";
import { MyAccounts } from "./components/my-accounts/my-accounts";
import { SharedAccounts } from "./components/shared-accounts/shared-accounts";
import { Transactions } from './components/transactions/transactions';
import { Account, AccountTransaction } from './models';

@Component({
  selector: 'app-card',
  imports: [HeaderPartial, MyAccounts, SharedAccounts, Transactions],
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
        <app-my-accounts (activeAccountEmitter)="changeActiveAccount($event, 'owner')" [isLoading]="isLoadingAccount()" [accounts]="accounts()" />
      </section>

      <section class="goals">
        <app-shared-accounts (activeAccountEmitter)="changeActiveAccount($event, 'shared')" [isLoading]="isLoadingAccount()" [accounts]="sharedAccounts()" />
      </section>

      <section class="latest-transactions">
        <app-account-transactions [isLoading]="isLoadingTransactions()" [dependencies]="{ account: this.active().account ?? this.accounts()[0] }" [transactions]="transactions()" />
      </section>

    </div>
  `,
  styles: ``
})
export class AccountPage implements OnInit {
  isLoadingAccount = signal(false);
  isLoadingTransactions = signal(false);
  active = signal<{ index: number, account?: Account }>({
    index: 0
  });

  accounts: WritableSignal<Account[]> = signal([]);
  sharedAccounts: WritableSignal<Account[]> = signal([]);
  transactions: WritableSignal<AccountTransaction[]> = signal([]);

  ngOnInit(): void {
    
  }

  changeActiveAccount(index: number, reference: 'owner' | 'shared'): void {
    switch (reference) {
      case 'owner':
        this.active.set({ index, account: this.accounts()[index] });
        break;
      case 'shared':
        this.active.set({ index, account: this.sharedAccounts()[index] });
        break;
      default:
        this.active.set({ index: 0 });
        break;
    }
  }

}
