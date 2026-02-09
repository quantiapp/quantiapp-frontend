import { computed, inject, Injectable, Signal } from "@angular/core";
import { Conversion, DashboardSummary } from "@client/secure/features/dashboard/models";
import { FinanceStore } from "@core/data/finance-store.data";
import { UserStore } from "@core/data/user-store.data";
import { BaseAccountViewModel } from "@core/models/base-account.model";
import { BaseGoalViewModel } from "@core/models/base-goal.model";
import { BaseTransactionViewModel } from "@core/models/base-transaction.model";

@Injectable({
    providedIn: 'root'
})
export class FinanceStoreViewModel {

    private financeStore = inject(FinanceStore);
    private userStore = inject(UserStore);

    dashboardSummary: Signal<DashboardSummary> = computed(() => {
        const user_currency = this.financeStore.mappedCurrencies()[this.userStore.settings()!.currency_id];

        let totalBalance: number = this.accountsWithBalances().reduce((value, account) => {
            const valueInBaseCurrency = account.balance / account.currency.rate_to_base;
            const coverted = valueInBaseCurrency * user_currency.rate_to_base;

            if(account.currency.code === user_currency.code){
                return value + account.balance;
            }
            return Math.round((value + coverted) * 100) / 100;
        }, 0)

        let currencies_by_accounts: string[] = this.financeStore.accounts().map(account => account.currency_id).filter(curr => curr !== user_currency.id);
        currencies_by_accounts = [...new Set(currencies_by_accounts)];
        
        let conversions: Conversion[] = currencies_by_accounts.map(c_id => {
            return {
                from: this.financeStore.mappedCurrencies()[c_id].code,
                value: user_currency.rate_to_base / this.financeStore.mappedCurrencies()[c_id].rate_to_base
            }
        });

        return {
            total_balance: totalBalance,
            exchanges: {
                user_currency,
                conversions
            }
        }
    });

    accountsWithBalances: Signal<BaseAccountViewModel[]> = computed(() => {
        return this.financeStore.accounts().map(account => ({
            ...account,
            can_see_balance: true,
            can_see_goals: true,
            can_see_transactions: true,
            account_type: this.financeStore.mappedAccountTypes()[account.account_type_id],
            balance: this.financeStore.goals().filter(g => g.account_id === account.id).reduce((value, goal) => goal.current_amount + value, 0),
            currency: this.financeStore.mappedCurrencies()[account.currency_id]
        }));
    });
    mappedAdaptedAccount: Signal<Record<string, BaseAccountViewModel>> = computed(() => {
        const map: Record<string, BaseAccountViewModel> = {};
        this.accountsWithBalances().forEach(ele => {
            map[ele.id] = ele;
        })
        return map;
    });

    sharedAccounts: Signal<BaseAccountViewModel[]> = computed(() => {
        return this.financeStore.shared_accounts().map(account => ({
            ...account,
            can_see_balance: account.permissions?.can_see_amount ?? true,
            can_see_goals: account.permissions?.can_see_goals ?? true,
            can_see_transactions: account.permissions?.can_see_transactions ?? true,
            account_type: this.financeStore.mappedAccountTypes()[account.account_type_id],
            currency: this.financeStore.mappedCurrencies()[account.currency_id]
        }));
    });

    goalsWithAccounts: Signal<BaseGoalViewModel[]> = computed(() => {

        const goals = this.financeStore.goals();
        const accountsMap = this.mappedAdaptedAccount();

        return goals.map(goal => ({
            ...goal,
            progress: (goal.current_amount * 100)/goal.target_amount,
            account: accountsMap[goal.account_id] || null
        }))
    });
    mappedAdaptedGoals: Signal<Record<string, BaseGoalViewModel>> = computed(() => {
        const map: Record<string, BaseGoalViewModel> = {};
        this.goalsWithAccounts().forEach(ele => {
            map[ele.id] = ele;
        });
        return map;
    });

    goalsByAccount(account_id: string): BaseGoalViewModel[] {
        return this.goalsWithAccounts().filter(g => g.account.id === account_id);
    };

    transactionsWithGoals: Signal<BaseTransactionViewModel[]> = computed((() => {
        return this.financeStore.transactions().map(tx => ({
            ...tx,
            origin: tx.origin_id ? this.mappedAdaptedGoals()[tx.origin_id] : null,
            destination: tx.destination_id ? this.mappedAdaptedGoals()[tx.destination_id] : null,
            origin_currency: tx.origin_currency_id ? this.financeStore.mappedCurrencies()[tx.origin_currency_id] : null,
            destination_currency: tx.destination_currency_id ? this.financeStore.mappedCurrencies()[tx.destination_currency_id] : null,
        }
        ))
    }));

}