import { computed, Injectable, Signal, signal } from "@angular/core";
import { AccountType } from "@core/models/account-type.model";
import { BaseAccount } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { Currency } from "@core/models/currency.model";
import { list } from "postcss";

@Injectable({
    providedIn: 'root'
})
export class FinanceStore {
    private _accounts = signal<BaseAccount[]>([]);
    private _shared_accounts = signal<BaseAccount[]>([]);
    private _goals = signal<BaseGoal[]>([]);
    private _transactions = signal<BaseTransaction[]>([]);
    private _latest_transactions = signal<BaseTransaction[]>([]);

    private _currencies = signal<Currency[]>([]);
    private _accountTypes = signal<AccountType[]>([]);

    currencies: Signal<Currency[]> = this._currencies.asReadonly();
    baseCurrency: Signal<Currency> = computed(() => this._currencies().find(c => c.is_base)!);
    accountTypes: Signal<AccountType[]> = this._accountTypes.asReadonly();

    accounts: Signal<BaseAccount[]> = this._accounts.asReadonly();
    shared_accounts: Signal<BaseAccount[]> = this._shared_accounts.asReadonly();
    goals: Signal<BaseGoal[]> = this._goals.asReadonly();

    transactions: Signal<BaseTransaction[]> = this._transactions.asReadonly();
    latest_transactions: Signal<BaseTransaction[]> = this._latest_transactions.asReadonly();

    mappedAccounts: Signal<Record<string, BaseAccount>> = computed(() => {
        const map: Record<string, BaseAccount> = {};
        this._accounts().forEach(account => {
            map[account.id] = account
        })
        return map;
    });

    mappedSharedAcconts: Signal<Record<string, BaseAccount>> = computed(() => {
        const map: Record<string, BaseAccount> = {};
        this._shared_accounts().forEach(account => {
            map[account.id] = account
        })
        return map; 
    })
    
    mappedGoals: Signal<Record<string, BaseGoal>> = computed(() => {
        const map: Record<string, BaseGoal> = {};
        this._goals().forEach(goal => {
            map[goal.id] = goal;
        })
        return map;
    });

    mappedCurrencies: Signal<Record<string, Currency>> = computed(() => {
        const map: Record<string, Currency> = {};
        this._currencies().forEach(currency => {
            map[currency.id] = currency;
        });
        return map;
    });

    mappedAccountTypes: Signal<Record<string, AccountType>> = computed(() => {
        const map: Record<string, AccountType> = {};
        this._accountTypes().forEach(type => {
            map[type.id] = type;
        });
        return map;
    });

    loadCurrencies(data: Currency[]) {
        this._currencies.set(data);
    }

    loadAccountTypes(data: AccountType[]) {
        this._accountTypes.set(data);
    }

    loadAccounts(data: BaseAccount[]) {
        this._accounts.set(data);
    }

    addAccount(account: BaseAccount) {
        this._accounts.update(list => [ ...list, account ]);
    }

    updateLocalAccount(id: string, changes: Partial<BaseAccount>) {
        this._accounts.update(list => list.map(account => account.id === id ? { ...account, ...changes } : account))
    }

    removeLocalAccount(id: string) {
        this._accounts.update(list => list.filter(account => account.id !== id));
    }

    loadSharedAccounts(data: BaseAccount[]) {
        this._shared_accounts.set(data);
    }

    loadGoals(data: BaseGoal[]) {
        this._goals.set(data);
    }

    AddGoal(goal: BaseGoal) {
        this._goals.update(list => [...list, goal]);
    }

    updateLocalGoal(id: string, changes: Partial<BaseGoal>) {
        this._goals.update(list => list.map(goal => goal.id === id ? { ...goal, ...changes } : goal))
    }

    removeLocalGoal(id: string) {
        this._goals.update(list => list.filter(goal => goal.id !== id));
    }

    // 

    loadTransactions(data: BaseTransaction[]) {
        this._transactions.set(data);
    }

    addTransaction(transaction: BaseTransaction) {
        this._transactions.update(list => [...list, transaction]);
    }

    updateLocalTransaction(id: string, changes: Partial<BaseTransaction>) {
        this._transactions.update(list => list.map(transaction => transaction.id === id ? { ...transaction, ...changes } : transaction))
    }

    removeLocalTransaction(id: string) {
        this._transactions.update(list => list.filter(transaction => transaction.id !== id));
    }

    // 

    loadLatestTransactions(data: BaseTransaction[]) {
        this._latest_transactions.set(data);
    }

    addLatestTransaction(transaction: BaseTransaction) {
        this._latest_transactions.update(list => [...list, transaction]);
    }

    updateLocalLatestTransaction(id: string, changes: Partial<BaseTransaction>) {
        this._latest_transactions.update(list => list.map(transaction => transaction.id === id ? { ...transaction, ...changes } : transaction))
    }

    removeLocalLatestTransaction(id: string) {
        this._latest_transactions.update(list => list.filter(transaction => transaction.id !== id));
    }
}
