import { Injectable } from "@angular/core";
import { Mockery } from "@core/abstracts/mock.abstract";
import { BaseGoal } from "@core/models/base-goal.model";
import { delay, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GoalSimulator extends Mockery {
    
    goals(): Observable<BaseGoal[]> {
        return this.convertToObservable(this.MOCK_GOALS);
    }

    goalsBySharedAccount(accountId: string): Observable<BaseGoal[]> {
        const goals = this.MOCK_SHARED_GOALS.filter(goal => goal.account_id === accountId);
        return this.convertToObservable(goals);
    }

    private convertToObservable(data: BaseGoal[]): Observable<BaseGoal[]> {
        return of(data).pipe(delay(2000));
    }
}