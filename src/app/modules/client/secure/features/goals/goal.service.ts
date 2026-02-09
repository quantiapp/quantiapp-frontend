import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { FinanceStore } from "@core/data/finance-store.data";
import { BaseGoal } from "@core/models/base-goal.model";
import { Observable, tap } from "rxjs";
import { GoalSimulator } from "./simulator.service";

@Injectable({
    providedIn: 'root'
})
export class GoalService extends BaseResourceService<BaseGoal> {
    private simulator = inject(GoalSimulator);
    private financeStore = inject(FinanceStore);

    override getAll(): Observable<BaseGoal[]> {
        // return super.getAll('/api/goals').pipe(
        return this.simulator.goals().pipe(
            tap((data) => this.financeStore.loadGoals(data))
        )
    }
}