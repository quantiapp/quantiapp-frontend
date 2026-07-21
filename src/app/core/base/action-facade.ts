import { Directive, inject, signal } from "@angular/core";
import { AccountService } from "@client/secure/features/accounts/account.service";
import { GoalService } from "@client/secure/features/goals/goal.service";
import { TransactionService } from "@client/secure/features/transactions/transaction.service";
import { FinanceStore } from "@core/data/finance-store.data";
import { UserStore } from "@core/data/user-store.data";
import { FacadeDispatchableAction } from "@core/interfaces/facade-dispatchable-action.interface";
import { AccountTypeService } from "@core/services/account-type.service";
import { CurrencyService } from "@core/services/currency.service";
import { UserService } from "@core/services/user.service";
import { HttpSchema } from "@core/services/http-schema.service";
import { Observable, of, finalize, catchError, tap } from "rxjs";

@Directive()
export abstract class BaseActionFacade implements FacadeDispatchableAction {

    protected accountService = inject(AccountService);
    protected goalService = inject(GoalService);
    protected transactionService = inject(TransactionService);
    protected currencyService = inject(CurrencyService);
    protected accountTypeService = inject(AccountTypeService);
    protected userService = inject(UserService);
    protected httpSchema = inject(HttpSchema);

    protected financeStore = inject(FinanceStore);
    protected userStore = inject(UserStore);

    isLoadingAccount = signal(false);
    isLoadingGoals = signal(false);
    isLoadingTransactions = signal(false);

    action(deps?: any): Observable<any> {
        if (this.ignoreAction()) {
            return of(true);
        }

        this.isLoadingAccount.set(!this.financeStore.isAccountsLoaded());
        this.isLoadingGoals.set(!this.financeStore.isGoalsLoaded());
        this.isLoadingTransactions.set(!this.financeStore.isLatestTransactionsLoaded());

        return this.httpSchema.get<any>('api/bootstrap').pipe(
            tap(data => {
                if (data) {
                    if (data.profile) this.userStore.loadUser(data.profile);
                    if (data.settings) this.userStore.loadSettings(data.settings);

                    if (data.currencies) this.financeStore.loadCurrencies(data.currencies);
                    if (data.account_types) this.financeStore.loadAccountTypes(data.account_types);
                    if (data.accounts) this.financeStore.loadAccounts(data.accounts);
                    if (data.shared_accounts) this.financeStore.loadSharedAccounts(data.shared_accounts);
                    if (data.goals) this.financeStore.loadGoals(data.goals);
                    if (data.latest_transactions) this.financeStore.loadLatestTransactions(data.latest_transactions);
                }
            }),
            catchError(() => of(null)),
            finalize(() => {
                this.isLoadingAccount.set(false);
                this.isLoadingGoals.set(false);
                this.isLoadingTransactions.set(false);
            })
        );
    }

    ignoreAction(deps?: any): boolean {
        return  this.userStore.isUserLoaded() &&
                this.userStore.isSettingsLoaded() &&
                this.financeStore.isAccountsLoaded() &&
                this.financeStore.isGoalsLoaded() &&
                this.financeStore.isLatestTransactionsLoaded();
    }

}