import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { FinanceStore } from "@core/data/finance-store.data";
import { BaseGoal } from "@core/models/base-goal.model";
import { map, Observable, tap } from "rxjs";
import { CreateGoalDTO, UpdateGoalDTO } from "@core/dtos/goal.dto";

@Injectable({
    providedIn: 'root'
})
export class GoalService extends BaseResourceService<BaseGoal> {
    private financeStore = inject(FinanceStore);

    private ensureArray(res: any): BaseGoal[] {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        if (res && Array.isArray(res.goals)) return res.goals;
        if (res && Array.isArray(res.items)) return res.items;
        return [];
    }

    override getAll(): Observable<BaseGoal[]> {
        return super.getAll('api/goals').pipe(
            map(res => this.ensureArray(res)),
            tap((data) => this.financeStore.loadGoals(data))
        );
    }

    override create(resource: CreateGoalDTO): Observable<BaseGoal> {
        return super.create(resource.contract, `api/goals/create`).pipe(
            map(res => (res as any)?.data || res),
            tap((goal) =>  {
                if (goal?.id) {
                    this.financeStore.AddGoal(goal);
                }
            })
        );
    }

    override update(id: string, resource: UpdateGoalDTO): Observable<BaseGoal> {
        return super.update(id, resource.contract, 'api/goals/update').pipe(
            tap(() => {
                this.financeStore.updateLocalGoal(id, resource.contract);
            })
        );
    }

    override delete(id: string): Observable<BaseGoal> {
        return super.delete(id, 'api/goals/delete').pipe(
            tap(() => {
                this.financeStore.removeLocalGoal(id);
            })
        );
    }

    getGoalsBySharedAccount(accountId: string): Observable<BaseGoal[]> {
        return super.getAll(`api/accounts/${accountId}/goals`).pipe(
            map(res => this.ensureArray(res)),
            tap((data) => this.financeStore.upsertGoals(data))
        );
    }
}