import { Component, inject, OnInit, signal, computed, Signal } from '@angular/core';
import { HeaderPartial } from "@core/partials/client/secure/header.partial";
import { Darkable } from "@shared/directives/darkable";
import { TotalBalanceComponent } from './components/total-balance/total-balance.component';
import { DashboardFacade } from './dashboard.facade';
import { DashboardSummary } from './models';
import { AccountsComponent } from "./components/accounts/accounts.component";
import { GoalsComponent } from "./components/goals/goals.component";
import { TransactionsComponent } from "./components/transactions/transactions.component";
import { FinanceStoreViewModel } from '@core/view-models/finance-store.viewmodel';
import { FinanceStore } from '@core/data/finance-store.data';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderPartial, Darkable, TotalBalanceComponent, AccountsComponent, GoalsComponent, TransactionsComponent],
  template: `
    <div class="section-container py-8 flex flex-col gap-6 limited-container">

      <section class="header">
        <app-header>
          <p class="text-sm font-medium" appDarkable="dark:text-(color:--dm-secondary)">
            O primeiro passo é o mais valioso
          </p>
        </app-header>
      </section>

      <section class="total-balance">
        <app-total-balance [summary]="summary()" />
      </section>

      <section class="accounts">
        <app-dashboard-accounts [isLoading]="facade.isLoadingAccount()" [accounts]="accounts()" (activeAccountEmitter)="updateActiveAccount($event)" />
      </section>

      <section class="goals">
        <app-dashboard-goals [isLoading]="facade.isLoadingGoals()" [activeAccountId]="activeAccountId()" [goals]="goals()" />
      </section>

      <section class="latest-transactions">
        <app-dashboard-transactions [isLoading]="facade.isLoadingTransactions()" [transactions]="transactions()" />
      </section>

    </div>
  `,
  styles: ``
})
export class DashboardPage implements OnInit {
  activeAccount = signal<number>(0);
  activeGoal = signal<number>(0);

  facade = inject(DashboardFacade);
  financeStoreViewModel = inject(FinanceStoreViewModel);
  private financeStore = inject(FinanceStore);
  
  summary: Signal<DashboardSummary> = computed(() => this.financeStoreViewModel.dashboardSummary());
  accounts = computed(() => this.financeStoreViewModel.accountsWithBalances());
  activeAccountId = computed(() => this.accounts()?.[this.activeAccount()]?.id);
  goals = computed(() => {
    const accList = this.accounts();
    const activeIdx = this.activeAccount();
    const currentAcc = accList?.[activeIdx] || accList?.[0];
    if (!currentAcc?.id) return [];
    return this.financeStoreViewModel.goalsByAccountIdMap()[currentAcc.id] || [];
  });
  transactions = computed(() => this.financeStore.latest_transactions());

  ngOnInit(): void {}

  updateActiveAccount(index: number): void {
    this.activeGoal.set(0);
    this.activeAccount.set(index);
  }
}
