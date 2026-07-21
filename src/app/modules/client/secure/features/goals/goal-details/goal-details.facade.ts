import { Injectable, signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { Observable, of, forkJoin, tap, finalize } from "rxjs";
import { TheAccount } from "../../accounts/account-details/details.page";
import { TheGoal } from "./goal-details.page";

@Injectable({
    providedIn: 'root'
})
export class GoalDetailsFacade extends BaseActionFacade {

    private _goal = signal<TheGoal | null>(null);
    account = this._goal.asReadonly();

    setGoal(data: TheGoal): void {
        this._goal.set(data);
    }

    getTransactionsByGoal(goalId: string): Observable<BaseTransaction[]> {
        const cached = this.financeStore.transactionsByGoalIdMap()[goalId];
        return (cached) ?
                of(cached) :
                this.transactionService.transactionsByGoal(goalId).pipe();
    }

    // override action(deps: { goalId: string }): Observable<any> {
    //     const callers: Observable<any>[] = [];

    //     if(this.financeStore.goalsByAccountIdMap()[deps.goalId] === undefined) {
    //         callers.push(this.goalService.getGoalsBySharedAccount(deps.goalId));
    //     }
        
    //     return forkJoin(callers).pipe(
    //         tap(console.log),
    //         finalize(() => {})
    //     );
    // }

    // override ignoreAction(deps: { goalId: string }): boolean {
    //     return this.financeStore.transactionsByGoalIdMap()[deps.goalId] !== undefined;
    // }
}