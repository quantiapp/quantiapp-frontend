import { computed, inject, Injectable, Signal } from "@angular/core";
import { Conversion, DashboardSummary } from "@client/secure/features/dashboard/models";
import { FinanceStore } from "@core/data/finance-store.data";
import { UserStore } from "@core/data/user-store.data";
import { AccountShare, BaseAccountViewModel } from "@core/models/base-account.model";
import { BaseGoalViewModel } from "@core/models/base-goal.model";

@Injectable({
    providedIn: 'root'
})
export class FinanceStoreViewModel {

    private financeStore = inject(FinanceStore);
    private userStore = inject(UserStore);

    dashboardSummary: Signal<DashboardSummary> = computed(() => {
        const settings = this.userStore.settings();
        const currId = settings?.currency_id || 'curr_aoa';
        const currenciesMap = this.financeStore.currenciesMap();
        const user_currency = currenciesMap[currId] || { id: 'curr_aoa', code: 'AOA', name: 'Kwanza', is_base: true, rate_to_base: 1 };

        let totalBalance: number = this.accountsWithBalances().reduce((value, account) => {
            const accRate = account.currency?.rate_to_base || 1;
            const valueInBaseCurrency = account.balance / accRate;
            const coverted = valueInBaseCurrency * (user_currency.rate_to_base || 1);

            if (account.currency?.code === user_currency.code) {
                return value + account.balance;
            }
            return Math.round((value + coverted) * 100) / 100;
        }, 0);

        let currencies_by_accounts: string[] = this.financeStore.accounts().map(account => account.currency_id).filter(curr => curr && curr !== user_currency.id);
        currencies_by_accounts = [...new Set(currencies_by_accounts)];
        
        let conversions: Conversion[] = currencies_by_accounts.map(c_id => {
            const cObj = currenciesMap[c_id];
            return {
                from: cObj?.code || c_id,
                value: cObj?.rate_to_base ? ((user_currency.rate_to_base || 1) / cObj.rate_to_base) : 1
            };
        });

        return {
            total_balance: totalBalance,
            exchanges: {
                user_currency,
                conversions
            }
        };
    });

    accountsWithBalances: Signal<BaseAccountViewModel[]> = computed(() => {
        const canSee = this.userStore.canSeeBalances();
        return this.financeStore.accounts().map(account => ({
            ...account,
            can_see_balance: canSee,
            can_see_goals: true,
            can_see_transactions: true,
            income_transaction: true,
            outcome_transaction: true,
            account_type: this.financeStore.accountTypesMap()[account.account_type_id],
            balance: this.financeStore.goals().filter(g => g.account_id === account.id).reduce((value, goal) => goal.current_amount + value, 0),
            currency: this.financeStore.currenciesMap()[account.currency_id]
        }));
    });

    ownedAccountsMap: Signal<Record<string, BaseAccountViewModel>> = computed(() => {
        const map: Record<string, BaseAccountViewModel> = {};
        this.accountsWithBalances().forEach(ele => {
            if (ele?.id) {
                map[ele.id] = ele;
            }
        });
        return map;
    });

    sharedAccounts: Signal<BaseAccountViewModel[]> = computed(() => {
        const canSee = this.userStore.canSeeBalances();
        return this.financeStore.shared_accounts().map(account => ({
            ...account,
            can_see_balance: canSee ? (account.permissions?.can_see_amount ?? true) : false,
            can_see_goals: account.permissions?.can_see_goals ?? true,
            can_see_transactions: account.permissions?.can_see_transactions ?? true,
            income_transaction: account.permissions?.income_transaction ?? true,
            outcome_transaction: account.permissions?.outcome_transaction ?? true,
            account_type: this.financeStore.accountTypesMap()[account.account_type_id],
            currency: this.financeStore.currenciesMap()[account.currency_id]
        }));
    });

    sharedAccountsMap: Signal<Record<string, BaseAccountViewModel>> = computed(() => {
        const map: Record<string, BaseAccountViewModel> = {};
        this.sharedAccounts().forEach(ele => {
            if (ele?.id) {
                map[ele.id] = ele;
            }
        });
        return map;
    });

    accountShare: Signal<AccountShare> = computed(() => this.financeStore.accountShare());

    goals: Signal<BaseGoalViewModel[]> = computed(() => {
        const goals = this.financeStore.goals();
        const accountsMap = this.ownedAccountsMap();
        const sharedAccountsMap = this.sharedAccountsMap();

        return goals.map(goal => ({
            ...goal,
            excess_amount: goal.current_amount - goal.target_amount,
            progress: goal.target_amount > 0 ? (goal.current_amount * 100) / goal.target_amount : 0,
            account: accountsMap[goal.account_id] || sharedAccountsMap[goal.account_id] || null
        }));
    });

    goalsMap: Signal<Record<string, BaseGoalViewModel>> = computed(() => {
        const map: Record<string, BaseGoalViewModel> = {};
        this.goals().forEach(ele => {
            if (ele?.id) {
                map[ele.id] = ele;
            }
        });
        return map;
    });

    goalsByAccountIdMap: Signal<Record<string, BaseGoalViewModel[]>> = computed(() => {
        const map: Record<string, BaseGoalViewModel[]> = {};
        this.goals().forEach(goal => {
            const accountId = goal.account?.id;
            if (accountId) {
                if (!map[accountId]) {
                    map[accountId] = [];
                }
                map[accountId].push(goal);
            }
        });
        return map;
    });

    goalsByAccount(account_id: string): BaseGoalViewModel[] {
        return this.goals().filter(g => g.account?.id === account_id);
    }
}