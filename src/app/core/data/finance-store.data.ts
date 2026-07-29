import { computed, Injectable, Signal, signal } from "@angular/core";
import { AccountType } from "@core/models/account-type.model";
import { AccountAccess, AccountShare, BaseAccount, TransferGoalResource } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { Currency } from "@core/models/currency.model";

export interface GoalState {
    goals: BaseGoal[];
    sharedGoals: Record<string, BaseGoal>;
}

@Injectable({
    providedIn: 'root'
})
export class FinanceStore {
    private _accounts = signal<BaseAccount[]>([]);
    private _shared_accounts = signal<BaseAccount[]>([]);
    private _account_share = signal<AccountShare>({});

    private _goals = signal<BaseGoal[]>([]);
    initialGoalState = {
        goals: [],
        sharedGoals: {}
    };

    private _transactions = signal<BaseTransaction[]>([]);
    private _latest_transactions = signal<BaseTransaction[]>([]);
    private _transactionsByAccountId = signal<Record<string, BaseTransaction[]>>({});
    private _transactionsByGoalId = signal<Record<string, BaseTransaction[]>>({});

    private _currencies = signal<Currency[]>([]);
    private _accountTypes = signal<AccountType[]>([]);

    isAccountsLoaded = signal<boolean>(false);
    isSharedAccountsLoaded = signal<boolean>(false);
    isGoalsLoaded = signal<boolean>(false);
    isLatestTransactionsLoaded = signal<boolean>(false);
    isCurrenciesLoaded = signal<boolean>(false);
    isAccountTypesLoaded = signal<boolean>(false);

    currencies: Signal<Currency[]> = this._currencies.asReadonly();
    baseCurrency: Signal<Currency> = computed(() => this._currencies().find(c => c.is_base)!);
    accountTypes: Signal<AccountType[]> = this._accountTypes.asReadonly();

    accounts: Signal<BaseAccount[]> = this._accounts.asReadonly();
    shared_accounts: Signal<BaseAccount[]> = this._shared_accounts.asReadonly();
    accountShare: Signal<AccountShare> = this._account_share.asReadonly();
    goals: Signal<BaseGoal[]> = this._goals.asReadonly();

    transactions: Signal<BaseTransaction[]> = this._transactions.asReadonly();
    latest_transactions: Signal<BaseTransaction[]> = this._latest_transactions.asReadonly();

    transactionsByAccountIdMap: Signal<Record<string, BaseTransaction[]>> = this._transactionsByAccountId.asReadonly();
    transactionsByGoalIdMap: Signal<Record<string, BaseTransaction[]>> = this._transactionsByGoalId.asReadonly();

    accountsMap: Signal<Record<string, BaseAccount>> = computed(() => {
        const map: Record<string, BaseAccount> = {};
        this._accounts().forEach(account => {
            map[account.id] = account;
        });
        return map;
    });

    sharedAccountsMap: Signal<Record<string, BaseAccount>> = computed(() => {
        const map: Record<string, BaseAccount> = {};
        this._shared_accounts().forEach(account => {
            map[account.id] = account;
        });
        return map; 
    });
    
    goalsMap: Signal<Record<string, BaseGoal>> = computed(() => {
        const map: Record<string, BaseGoal> = {};
        this._goals().forEach(goal => {
            map[goal.id] = goal;
        });
        return map;
    });

    goalsByAccountIdMap: Signal<Record<string, BaseGoal[]>> = computed(() => {
        const map: Record<string, BaseGoal[]> = {};
        this._goals().forEach(goal => {
            const accountId = goal.account_id;
            if (!map[accountId]) {
                map[accountId] = [];
            }
            map[accountId].push(goal);
        });
        return map;
    });

    currenciesMap: Signal<Record<string, Currency>> = computed(() => {
        const map: Record<string, Currency> = {};
        this._currencies().forEach(currency => {
            map[currency.id] = currency;
        });
        return map;
    });

    accountTypesMap: Signal<Record<string, AccountType>> = computed(() => {
        const map: Record<string, AccountType> = {};
        this._accountTypes().forEach(type => {
            map[type.id] = type;
        });
        return map;
    });

    loadCurrencies(data: Currency[]) {
        this._currencies.set(data);
        this.isCurrenciesLoaded.set(true);
    }

    loadAccountTypes(data: AccountType[]) {
        this._accountTypes.set(data);
        this.isAccountTypesLoaded.set(true);
    }

    loadAccounts(data: BaseAccount[]) {
        this._accounts.set(data);
        this.isAccountsLoaded.set(true);
    }

    addAccount(account: BaseAccount) {
        this._accounts.update(list => [ ...list, account ]);
    }

    updateLocalAccount(id: string, changes: Partial<BaseAccount>) {
        this._accounts.update(list => list.map(account => account.id === id ? { ...account, ...changes } : account));
    }

    removeLocalAccount(id: string) {
        this._accounts.update(list => list.filter(account => account.id !== id));
    }

    loadSharedAccounts(data: BaseAccount[]) {
        this._shared_accounts.set(data);
        this.isSharedAccountsLoaded.set(true);
    }

    loadAccountShare(data: AccountShare) {
        this._account_share.set(data);
    }

    addLocalShareUser(data: AccountAccess) {
        this._account_share.update((state: AccountShare) => {
            const currentList = state[data.id] || [];
            return {
                ...state,
                [data.id]: [...currentList, data]
            };
        });
    }
    
    updateLocalShareUser(data: AccountAccess) {
        this._account_share.update((state: AccountShare) => {
            const currentList = state[data.id];
            if (!currentList) return state;

            const updatedList = currentList.map(access => {
                if (access.user.id === data.user.id) {
                    return { ...access, ...data };
                }
                return access;
            });

            return {
                ...state,
                [data.id]: updatedList
            };
        });
    }

    removeLocalShareUser(id: string, account_id: string) {
        this._account_share.update((state: AccountShare) => {
            const currentUsers = state[account_id];
            if (!currentUsers) return state;
            return {
                ...state,
                [account_id]: currentUsers.filter(ac => ac.user.id !== id)
            };
        });
    }

    upsertGoals(goals: BaseGoal[]) {
        this._goals.update(currentGoals => {
            const goalMap = new Map(currentGoals.map(g => [g.id, g]));
            goals.forEach(g => {
                goalMap.set(g.id, g);
            });
            return Array.from(goalMap.values());
        });
        this.isGoalsLoaded.set(true);
    }

    loadGoals(data: BaseGoal[]) {
        this._goals.set(data);
        this.isGoalsLoaded.set(true);
    }

    AddGoal(goal: BaseGoal) {
        this._goals.update(list => [...list, goal]);
    }

    updateLocalGoal(id: string, changes: Partial<BaseGoal>) {
        this._goals.update(list => list.map(goal => goal.id === id ? { ...goal, ...changes } : goal));
    }

    transferGoal(resource: TransferGoalResource) {
        this._goals.update(list => {
            let goalExists = list.some(g => g.id === resource.goal);
            if (!goalExists) return list;
            return list.map(g => (g.id === resource.goal) ? { ...g, account_id: resource.destination_account } : g);
        });
    }

    removeLocalGoal(id: string) {
        this._goals.update(list => list.filter(goal => goal.id !== id));
    }

    loadAccountTransactions(accountId: string, transactions: BaseTransaction[], isLoadMore: boolean = false) {
        this._transactionsByAccountId.update(currentValue => {
            const currentTransactions = currentValue[accountId] || [];
            const updateList = isLoadMore ? [ ...currentTransactions, ...transactions ] : transactions;
            return {
                ...currentValue,
                [accountId]: updateList
            };
        });
    }

    loadGoalTransactions(goalId: string, transactions: BaseTransaction[], isLoadMore: boolean = false) {
        this._transactionsByGoalId.update(currentValue => {
            const currentTransactions = currentValue[goalId] || [];
            const updateList = isLoadMore ? [ ...currentTransactions, ...transactions ] : transactions;
            return {
                ...currentValue,
                [goalId]: updateList
            };
        });
    }

    loadTransactions(data: BaseTransaction[]) {
        this._transactions.set(data);
    }

    addTransaction(transaction: BaseTransaction) {
        this._transactions.update(list => [transaction, ...list]);
        this._latest_transactions.update(list => [transaction, ...list]);

        if (transaction.source?.id) {
            const srcId = transaction.source.id;
            if (transaction.source.type === 'goal') {
                this._transactionsByGoalId.update(curr => ({
                    ...curr,
                    [srcId]: [transaction, ...(curr[srcId] || [])]
                }));
            }
            const goal = this._goals().find(g => g.id === srcId);
            const accId = goal?.account_id || (transaction.source.type === 'account' ? srcId : null);
            if (accId) {
                this._transactionsByAccountId.update(curr => ({
                    ...curr,
                    [accId]: [transaction, ...(curr[accId] || [])]
                }));
            }
        }
        if (transaction.destination?.id) {
            const destId = transaction.destination.id;
            if (transaction.destination.type === 'goal') {
                this._transactionsByGoalId.update(curr => ({
                    ...curr,
                    [destId]: [transaction, ...(curr[destId] || [])]
                }));
            }
            const goal = this._goals().find(g => g.id === destId);
            const accId = goal?.account_id || (transaction.destination.type === 'account' ? destId : null);
            if (accId) {
                this._transactionsByAccountId.update(curr => ({
                    ...curr,
                    [accId]: [transaction, ...(curr[accId] || [])]
                }));
            }
        }

        this.applyBalanceEffects(transaction);
    }

    updateLocalTransaction(id: string, changes: Partial<BaseTransaction>) {
        const oldTx = this._transactions().find(t => t.id === id) || this._latest_transactions().find(t => t.id === id);
        if (!oldTx) return;

        this.revertBalanceEffects(oldTx);

        const updatedTx = { ...oldTx, ...changes };
        this._transactions.update(list => list.map(t => t.id === id ? updatedTx : t));
        this._latest_transactions.update(list => list.map(t => t.id === id ? updatedTx : t));

        this.applyBalanceEffects(updatedTx);
    }

    removeLocalTransaction(id: string) {
        const transaction = this._transactions().find(t => t.id === id) || this._latest_transactions().find(t => t.id === id);
        if (!transaction) return;

        this._transactions.update(list => list.filter(t => t.id !== id));
        this._latest_transactions.update(list => list.filter(t => t.id !== id));

        if (transaction.source?.id) {
            const srcId = transaction.source.id;
            this._transactionsByGoalId.update(curr => ({
                ...curr,
                [srcId]: (curr[srcId] || []).filter(t => t.id !== id)
            }));
            const goal = this._goals().find(g => g.id === srcId);
            const accId = goal?.account_id || (transaction.source.type === 'account' ? srcId : null);
            if (accId) {
                this._transactionsByAccountId.update(curr => ({
                    ...curr,
                    [accId]: (curr[accId] || []).filter(t => t.id !== id)
                }));
            }
        }
        if (transaction.destination?.id) {
            const destId = transaction.destination.id;
            this._transactionsByGoalId.update(curr => ({
                ...curr,
                [destId]: (curr[destId] || []).filter(t => t.id !== id)
            }));
            const goal = this._goals().find(g => g.id === destId);
            const accId = goal?.account_id || (transaction.destination.type === 'account' ? destId : null);
            if (accId) {
                this._transactionsByAccountId.update(curr => ({
                    ...curr,
                    [accId]: (curr[accId] || []).filter(t => t.id !== id)
                }));
            }
        }

        this.revertBalanceEffects(transaction);
    }

    private applyBalanceEffects(transaction: BaseTransaction) {
        const amount = transaction.amount;

        if (transaction.source) {
            if (transaction.source.type === 'goal') {
                const goalId = transaction.source.id;
                this._goals.update(goals => goals.map(g => {
                    if (g.id === goalId) {
                        const newAmount = g.current_amount - amount;
                        const excess_amount = newAmount > g.target_amount ? newAmount - g.target_amount : 0;
                        return { ...g, current_amount: newAmount, excess_amount, last_transaction: transaction };
                    }
                    return g;
                }));
                const goal = this._goals().find(g => g.id === goalId);
                if (goal) {
                    this._accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance - amount } : a
                    ));
                    this._shared_accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance - amount } : a
                    ));
                }
            } else if (transaction.source.type === 'account') {
                const accountId = transaction.source.id;
                this._accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance - amount } : a
                ));
                this._shared_accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance - amount } : a
                ));
            }
        }

        if (transaction.destination) {
            if (transaction.destination.type === 'goal') {
                const goalId = transaction.destination.id;
                this._goals.update(goals => goals.map(g => {
                    if (g.id === goalId) {
                        const newAmount = g.current_amount + amount;
                        const excess_amount = newAmount > g.target_amount ? newAmount - g.target_amount : 0;
                        return { ...g, current_amount: newAmount, excess_amount, last_transaction: transaction };
                    }
                    return g;
                }));
                const goal = this._goals().find(g => g.id === goalId);
                if (goal) {
                    this._accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance + amount } : a
                    ));
                    this._shared_accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance + amount } : a
                    ));
                }
            } else if (transaction.destination.type === 'account') {
                const accountId = transaction.destination.id;
                this._accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance + amount } : a
                ));
                this._shared_accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance + amount } : a
                ));
            }
        }
    }

    private revertBalanceEffects(transaction: BaseTransaction) {
        const amount = transaction.amount;

        if (transaction.source) {
            if (transaction.source.type === 'goal') {
                const goalId = transaction.source.id;
                this._goals.update(goals => goals.map(g => {
                    if (g.id === goalId) {
                        const newAmount = g.current_amount + amount;
                        const excess_amount = newAmount > g.target_amount ? newAmount - g.target_amount : 0;
                        return { ...g, current_amount: newAmount, excess_amount };
                    }
                    return g;
                }));
                const goal = this._goals().find(g => g.id === goalId);
                if (goal) {
                    this._accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance + amount } : a
                    ));
                    this._shared_accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance + amount } : a
                    ));
                }
            } else if (transaction.source.type === 'account') {
                const accountId = transaction.source.id;
                this._accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance + amount } : a
                ));
                this._shared_accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance + amount } : a
                ));
            }
        }

        if (transaction.destination) {
            if (transaction.destination.type === 'goal') {
                const goalId = transaction.destination.id;
                this._goals.update(goals => goals.map(g => {
                    if (g.id === goalId) {
                        const newAmount = g.current_amount - amount;
                        const excess_amount = newAmount > g.target_amount ? newAmount - g.target_amount : 0;
                        return { ...g, current_amount: newAmount, excess_amount };
                    }
                    return g;
                }));
                const goal = this._goals().find(g => g.id === goalId);
                if (goal) {
                    this._accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance - amount } : a
                    ));
                    this._shared_accounts.update(accounts => accounts.map(a => 
                        a.id === goal.account_id ? { ...a, balance: a.balance - amount } : a
                    ));
                }
            } else if (transaction.destination.type === 'account') {
                const accountId = transaction.destination.id;
                this._accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance - amount } : a
                ));
                this._shared_accounts.update(accounts => accounts.map(a => 
                    a.id === accountId ? { ...a, balance: a.balance - amount } : a
                ));
            }
        }
    }

    loadLatestTransactions(data: BaseTransaction[]) {
        this._latest_transactions.set(data);
        this.isLatestTransactionsLoaded.set(true);
    }

    addLatestTransaction(transaction: BaseTransaction) {
        this._latest_transactions.update(list => [transaction, ...list]);
    }

    updateLocalLatestTransaction(id: string, changes: Partial<BaseTransaction>) {
        this._latest_transactions.update(list => list.map(transaction => transaction.id === id ? { ...transaction, ...changes } : transaction));
    }

    removeLocalLatestTransaction(id: string) {
        this._latest_transactions.update(list => list.filter(transaction => transaction.id !== id));
    }

    clear() {
        this._accounts.set([]);
        this._shared_accounts.set([]);
        this._account_share.set({});
        this._goals.set([]);
        this._transactions.set([]);
        this._latest_transactions.set([]);
        this._transactionsByAccountId.set({});
        this._transactionsByGoalId.set({});
        this._currencies.set([]);
        this._accountTypes.set([]);
        this.isAccountsLoaded.set(false);
        this.isSharedAccountsLoaded.set(false);
        this.isGoalsLoaded.set(false);
        this.isLatestTransactionsLoaded.set(false);
        this.isCurrenciesLoaded.set(false);
        this.isAccountTypesLoaded.set(false);
    }
}

