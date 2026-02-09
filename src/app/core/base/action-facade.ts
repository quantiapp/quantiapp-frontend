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
import { Observable, of, forkJoin, finalize } from "rxjs";

@Directive()
export abstract class BaseActionFacade implements FacadeDispatchableAction {

    private accountService = inject(AccountService);
    private goalService = inject(GoalService);
    private transactionService = inject(TransactionService);
    private currencyService = inject(CurrencyService);
    private accountTypeService = inject(AccountTypeService);
    private userService = inject(UserService);

    private financeStore = inject(FinanceStore);
    private userStore = inject(UserStore);

    isLoadingAccount = signal(false);
    isLoadingGoals = signal(false);
    isLoadingTransactions = signal(false);

    action(): Observable<any> {
        this.isLoadingAccount.set(true);
        this.isLoadingGoals.set(true);
        this.isLoadingTransactions.set(true);
        
        let callers: Observable<any>[] = [];

        if(!(this.userStore.user())){
           callers.push(this.userService.getUser());
           callers.push(this.userService.getUserSettings())
        }

        if(!(this.financeStore.accounts().length > 0)) {
            callers.push(this.accountService.getAll());
        }

        if(!(this.financeStore.shared_accounts().length > 0)) {
            callers.push(this.accountService.shared());
        }

        if(!(this.financeStore.currencies().length > 0)) {
            callers.push(this.currencyService.getAll())
        }

        if(!(this.financeStore.accountTypes().length > 0)){
            callers.push(this.accountTypeService.getAll())
        }

        if(!(this.financeStore.goals().length > 0)) {
            callers.push(this.goalService.getAll());
        }

        if(!(this.financeStore.latest_transactions().length > 0)) {
            callers.push(this.transactionService.latest(5));
        }

        if(!(callers.length > 0)) return of();
        
        return forkJoin(callers).pipe(
            finalize(() => {
                this.isLoadingAccount.set(false);
                this.isLoadingGoals.set(false);
                this.isLoadingTransactions.set(false);
            })
        )
    }

    ignoreAction(): boolean {
        return  this.userStore.user() !== null &&
                this.userStore.settings() !== null &&
                this.financeStore.accounts().length > 0 &&
                this.financeStore.goals().length > 0 &&
                this.financeStore.latest_transactions().length > 0;
    }

}