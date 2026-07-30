import { computed, Injectable, Signal, signal, effect } from "@angular/core";
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
    private _accounts = signal<BaseAccount[]>(this.loadCache('accounts', []));
    private _shared_accounts = signal<BaseAccount[]>(this.loadCache('shared_accounts', []));
    private _account_share = signal<AccountShare>(this.loadCache('account_share', {}));

    private _goals = signal<BaseGoal[]>(this.loadCache('goals', []));
    initialGoalState = {
        goals: [],
        sharedGoals: {}
    };

    private _transactions = signal<BaseTransaction[]>(this.loadCache('transactions', []));
    private _latest_transactions = signal<BaseTransaction[]>(this.loadCache('latest_transactions', []));
    private _transactionsByAccountId = signal<Record<string, BaseTransaction[]>>(this.loadCache('transactionsByAccountId', {}));
    private _transactionsByGoalId = signal<Record<string, BaseTransaction[]>>(this.loadCache('transactionsByGoalId', {}));

    private _currencies = signal<Currency[]>(this.loadCache('currencies', []));
    private _accountTypes = signal<AccountType[]>(this.loadCache('accountTypes', []));

    isAccountsLoaded = signal<boolean>(this.loadCache('accounts', []).length > 0);
    isSharedAccountsLoaded = signal<boolean>(this.loadCache('shared_accounts', []).length > 0);
    isGoalsLoaded = signal<boolean>(this.loadCache('goals', []).length > 0);
    isLatestTransactionsLoaded = signal<boolean>(this.loadCache('latest_transactions', []).length > 0);
    isCurrenciesLoaded = signal<boolean>(this.loadCache('currencies', []).length > 0);
    isAccountTypesLoaded = signal<boolean>(this.loadCache('accountTypes', []).length > 0);

    currencies: Signal<Currency[]> = this._currencies.asReadonly();
    baseCurrency: Signal<Currency> = computed(() => this._currencies().find(c => c.is_base)!);
    accountTypes: Signal<AccountType[]> = this._accountTypes.asReadonly();

    constructor() {
        effect(() => {
            const accounts = this._accounts();
            const shared_accounts = this._shared_accounts();
            const goals = this._goals();
            const transactions = this._transactions();
            const latest_transactions = this._latest_transactions();
            const transactionsByAccountId = this._transactionsByAccountId();
            const transactionsByGoalId = this._transactionsByGoalId();
            const currencies = this._currencies();
            const accountTypes = this._accountTypes();
            const account_share = this._account_share();

            this.saveCache('accounts', accounts);
            this.saveCache('shared_accounts', shared_accounts);
            this.saveCache('goals', goals);
            this.saveCache('transactions', transactions);
            this.saveCache('latest_transactions', latest_transactions);
            this.saveCache('transactionsByAccountId', transactionsByAccountId);
            this.saveCache('transactionsByGoalId', transactionsByGoalId);
            this.saveCache('currencies', currencies);
            this.saveCache('accountTypes', accountTypes);
            this.saveCache('account_share', account_share);
        });
    }

    private loadCache<T>(key: string, defaultValue: T): T {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const cached = localStorage.getItem(`quantia_cache_${key}`);
            return cached ? JSON.parse(cached) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    private saveCache(key: string, data: any): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(`quantia_cache_${key}`, JSON.stringify(data));
        } catch (e) {
            console.error(`Erro ao salvar cache financeiro para ${key}:`, e);
        }
    }

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

    replaceTempId(tempId: string, realId: string) {
        // Replace in accounts
        this._accounts.update(list => list.map(acc => {
            if (acc.id === tempId) {
                return { ...acc, id: realId };
            }
            return acc;
        }));

        // Replace in shared accounts
        this._shared_accounts.update(list => list.map(acc => {
            if (acc.id === tempId) {
                return { ...acc, id: realId };
            }
            return acc;
        }));

        // Replace in goals
        this._goals.update(list => list.map(goal => {
            let updated = { ...goal };
            if (goal.id === tempId) {
                updated.id = realId;
            }
            if (goal.account_id === tempId) {
                updated.account_id = realId;
            }
            return updated;
        }));

        // Replace in transactions (main list and latest list)
        const replaceInTx = (tx: BaseTransaction): BaseTransaction => {
            let updated = { ...tx };
            if (tx.id === tempId) {
                updated.id = realId;
            }
            if (tx.source && tx.source.id === tempId) {
                updated.source = { ...tx.source, id: realId };
            }
            if (tx.destination && tx.destination.id === tempId) {
                updated.destination = { ...tx.destination, id: realId };
            }
            return updated;
        };

        this._transactions.update(list => list.map(replaceInTx));
        this._latest_transactions.update(list => list.map(replaceInTx));

        // Replace in transactions maps
        this._transactionsByAccountId.update(map => {
            const newMap: Record<string, BaseTransaction[]> = {};
            for (let key in map) {
                const newKey = key === tempId ? realId : key;
                newMap[newKey] = map[key].map(replaceInTx);
            }
            return newMap;
        });

        this._transactionsByGoalId.update(map => {
            const newMap: Record<string, BaseTransaction[]> = {};
            for (let key in map) {
                const newKey = key === tempId ? realId : key;
                newMap[newKey] = map[key].map(replaceInTx);
            }
            return newMap;
        });
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
        if (typeof window !== 'undefined') {
            const keysToRemove = [
                'quantia_cache_accounts',
                'quantia_cache_shared_accounts',
                'quantia_cache_account_share',
                'quantia_cache_goals',
                'quantia_cache_transactions',
                'quantia_cache_latest_transactions',
                'quantia_cache_transactionsByAccountId',
                'quantia_cache_transactionsByGoalId',
                'quantia_cache_currencies',
                'quantia_cache_accountTypes'
            ];
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
    }
}

