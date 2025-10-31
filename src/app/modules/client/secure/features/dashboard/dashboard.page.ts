import { Component, inject, OnInit, WritableSignal, signal, afterNextRender } from '@angular/core';
import { HeaderPartial } from "@core/partials/client/secure/header.partial";
import { Darkable } from "@shared/directives/darkable";
import { TotalBalanceComponent } from './components/total-balance/total-balance.component';
import { DashboardFacade } from './dashboard.facade';
import { DashboardAccount, DashboardGoal, DashboardSummary, DashboardTransaction } from './models';
import { dashboardProviders } from './providers';
import { tap } from 'rxjs';
import { AccountsComponent } from "./components/accounts/accounts.component";
import { GoalsComponent } from "./components/goals/goals.component";
import { TransactionsComponent } from "./components/transactions/transactions.component";

@Component({
  selector: 'app-dashboard',
  providers: [
    dashboardProviders()
  ],
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
        <app-dashboard-accounts [isLoading]="isLoadingAccount()" [accounts]="accounts()" (activeAccountEmitter)="updateActiveAccount($event)" />
      </section>

      <section class="goals">
        <app-dashboard-goals [dependencies]="{ account: this.accounts()[this.activeAccount()] }"  [isLoading]="isLoadingGoals()" [goals]="goals()" />
      </section>

      <section class="latest-transactions">
        <app-dashboard-transactions [dependencies]="{ account: this.accounts()[this.activeAccount()], goal: this.goals()[this.activeGoal()] }" [isLoading]="isLoadingTransactions()" [transactions]="transactions()" />
      </section>

    </div>
  `,
  styles: ``
})
export class DashboardPage implements OnInit {
  activeAccount = signal<number>(0);
  activeGoal = signal<number>(0);
  private facade = inject(DashboardFacade);

  isLoadingAccount = signal(false);
  isLoadingGoals = signal(false);
  isLoadingTransactions = signal(false);
  
  summary: WritableSignal<DashboardSummary> = signal({
    total_balance: 0,
    exchanges: {
      user_currency: {},
      conversions: []
    }
  });
  accounts: WritableSignal<DashboardAccount[]> = signal([]);
  goals: WritableSignal<DashboardGoal[]> = signal([]);
  transactions: WritableSignal<DashboardTransaction[]> = signal([]);

  ngOnInit(): void {
    this.loadSnapshot();
  }

  updateActiveAccount(index: number): void {
    this.isLoadingGoals.set(true);
    this.isLoadingTransactions.set(true);
    this.facade.changeActiveAccount(index);
    this.facade.goals$.subscribe({
      next: (goals) => {
        this.goals.set(goals);
        this.transactions.set([ ...goals[this.activeGoal()].latest_transactions ]);
        this.isLoadingGoals.set(false);
        this.isLoadingTransactions.set(false);
      }
    });
  }

  updateActiveGoal(index: number): void {
    this.isLoadingTransactions.set(true);

    this.facade.changeActiveGoal(index);
    this.facade.transactions$.subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.isLoadingTransactions.set(false);
      }
    });
  }

  private loadSnapshot(): void {
    this.isLoadingAccount.set(true);
    this.isLoadingGoals.set(true);
    this.isLoadingTransactions.set(true);
    
    this.facade.loadSnapshot.pipe(
      tap((snapshot) => {
        this.goals.set((snapshot.accounts[0]) ? snapshot.accounts[0].goals : []);
        if(this.goals().length > 0){
          this.updateActiveGoal(this.activeGoal());
        }
      })
    ).subscribe({
      next: async (snapshot) => {
        this.summary.set(snapshot.summary);
        this.accounts.set(snapshot.accounts);

        this.isLoadingAccount.set(false);
        this.isLoadingGoals.set(false);
        this.isLoadingTransactions.set(false);
      },
      error: error => {}
    });
  }
}
