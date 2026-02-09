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

    private convertToObservable(data: BaseGoal[]): Observable<BaseGoal[]> {
        return of(data).pipe(delay(2000));
    }
}