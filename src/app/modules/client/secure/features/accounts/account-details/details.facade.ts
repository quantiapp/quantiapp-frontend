import { Injectable, Signal, signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { finalize, forkJoin, Observable, of, tap } from "rxjs";
import { TheAccount } from "./details.page";

@Injectable({ providedIn: 'root' })
export class DetailsFacade extends BaseActionFacade {

    private _account = signal<TheAccount | null>(null);
    account = this._account.asReadonly();

    setAccount(data: TheAccount): void {
        this._account.set(data);
    }

    getGoalsBySharedAccount(accountId: string): Observable<BaseGoal[]> {
        const cached = this.financeStore.goalsByAccountIdMap()[accountId];
        return (cached) ?
                of(cached) :
                this.goalService.getGoalsBySharedAccount(accountId).pipe();
    }

    getTransactionsByAccount(accountId: string): Observable<BaseTransaction[]> {
        const cached = this.financeStore.transactionsByAccountIdMap()[accountId];
        return (cached) ?
                of(cached) :
                this.transactionService.transactionsByAccount(accountId).pipe();
    }

    override action(deps: { accountId: string }): Observable<any> {
        const callers: Observable<any>[] = [];

        if(this.financeStore.goalsByAccountIdMap()[deps.accountId] === undefined) {
            callers.push(this.goalService.getGoalsBySharedAccount(deps.accountId));
        }
        
        return forkJoin(callers).pipe(
            tap(console.log),
            finalize(() => {})
        );
    }

    override ignoreAction(deps: { accountId: string }): boolean {
        return this.financeStore.goalsByAccountIdMap()[deps.accountId] !== undefined;
    }
}