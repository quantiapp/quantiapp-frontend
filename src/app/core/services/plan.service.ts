import { computed, inject, Injectable } from '@angular/core';
import { FinanceStore } from '@core/data/finance-store.data';
import { UserStore } from '@core/data/user-store.data';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private userStore = inject(UserStore);
  private financeStore = inject(FinanceStore);

  planLimits = computed(() => this.userStore.planLimits());

  canCreateAccount = computed(() => {
    const limits = this.planLimits();
    if (!limits || limits.max_accounts === -1) return true;
    return this.financeStore.accounts().length < limits.max_accounts;
  });

  canCreateGoal = computed(() => (accountId?: string) => {
    const limits = this.planLimits();
    if (!limits || limits.max_goals_per_account === -1) return true;
    if (!accountId) return true;
    const goalsCount = (this.financeStore.goalsByAccountIdMap()[accountId] ?? []).length;
    return goalsCount < limits.max_goals_per_account;
  });

  canShareAccount = computed(() => (accountId?: string) => {
    const limits = this.planLimits();
    if (!limits || limits.max_shares === -1) return true;
    if (!accountId) return true;
    const shareCount = (this.financeStore.accountShare()[accountId] ?? []).length;
    return shareCount < limits.max_shares;
  });
}
