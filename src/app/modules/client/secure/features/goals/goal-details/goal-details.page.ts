import { Component, computed, DestroyRef, effect, inject, OnInit, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '@core/services/router.service';
import { FinanceStoreViewModel } from '@core/view-models/finance-store.viewmodel';
import { TheAccount } from '../../accounts/account-details/details.page';
import { GoalDetailsFacade } from './goal-details.facade';
import { BaseGoalViewModel } from '@core/models/base-goal.model';
import { GoalHeroComponent } from "./components/goal-hero/goal-hero.component";
import { PopupService } from '@core/services/pop-up.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoalInfoComponent } from "./components/goal-info/goal-info.component";
import { GoalTransactionsComponent } from "./components/goal-transactions/goal-transactions.component";
import { FinanceStore } from '@core/data/finance-store.data';
import { BaseTransaction } from '@core/models/base-transaction.model';
import { finalize, take } from 'rxjs';

export type TheGoal = {
  goal: BaseGoalViewModel
}

@Component({
  selector: 'app-goal-details',
  imports: [GoalHeroComponent, GoalInfoComponent, GoalTransactionsComponent],
  providers: [ GoalDetailsFacade ],
  template: `
    @if (goal()) {
      <div class="hero-section">
        <app-goal-hero [account]="account()!" [goal]="goal()!"></app-goal-hero>
      </div>
      <div class="sections-container flex flex-col min-h-screen gap-6 limited-container py-6">
        <div class="details-section">
          <app-goal-info [account]="account()!" [goal]="goal()!"></app-goal-info>
        </div>
        <div class="goal-transactions">
          <app-goal-transactions [isLoading]="isLoadingTransactions()" [transactions]="transactions()"></app-goal-transactions>
        </div>
      </div>
    }
  `,
  styles: ``
})
export class GoalDetailsPage implements OnInit {
  private financeStoreViewModel = inject(FinanceStoreViewModel);
  private financeStore = inject(FinanceStore);

  private routerService = inject(RouterService);
  private activatedRoute = inject(ActivatedRoute);
  private detailsFacade = inject(GoalDetailsFacade);

  openAccountSettingsDrawer = signal<boolean>(false);

  accountId = signal<string | null>(null);
  goalId = signal<string | null>(null);

  account: Signal<TheAccount | null> = computed(() => {
    const accId = this.accountId();
    if(!accId) return null;

    const ownedAccount = this.financeStoreViewModel.ownedAccountsMap()[accId];
    if(ownedAccount !== undefined) {
      return { type: 'owner', account: ownedAccount };
    }

    const sharedAccount = this.financeStoreViewModel.sharedAccountsMap()[accId];
    if(sharedAccount !== undefined) {
      return { type: 'shared', account: sharedAccount };
    }

    return null;
  });

  goal: Signal<TheGoal | null> = computed(() => {
    const gId = this.goalId();
    if(!gId) return null;

    const currentGoal = this.financeStoreViewModel.goalsMap()[gId];
    return currentGoal ? { goal: currentGoal } : null;
  });

  transactions = computed(() => {
    const gId = this.goalId();
    return (!gId) ? [] : (this.financeStore.transactionsByGoalIdMap()[gId] ?? []);
  });
  
  isLoadingTransactions = this.detailsFacade.isLoadingTransactions.asReadonly();

  constructor(private destroyRef: DestroyRef) {
    effect(() => {
      const currentGoal = this.goal();
      if(!currentGoal) return;

      this.detailsFacade.setGoal(currentGoal);
      untracked(() => {
        this.goalTransactions(currentGoal);
      })
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        const goal_id = params.get('id');
        const account_id = params.get('account');
        
        if(!goal_id || !account_id){
          this.routerService.routeToSecureIndex();
          return;
        }

        this.accountId.set(account_id);
        this.goalId.set(goal_id);

        if(!this.financeStoreViewModel.goalsMap()[goal_id]){
          PopupService.error("Impossível localizar a meta.");
          this.routerService.routeToSecureIndex();
        }
      }
    })
  }

  goalTransactions(goal: TheGoal): void {
    this.detailsFacade.isLoadingTransactions.set(true);
    this.detailsFacade.getTransactionsByGoal(goal.goal.id).pipe(takeUntilDestroyed(this.destroyRef), finalize(()=> this.detailsFacade.isLoadingTransactions.set(false))).subscribe();
  }

}
