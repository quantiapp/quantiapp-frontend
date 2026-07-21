import { Injectable, Signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { BaseAccount } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { Observable } from "rxjs";
import { CreateGoalDTO, UpdateGoalDTO } from "@core/dtos/goal.dto";

@Injectable({ providedIn: 'root' })
export class GoalFacade extends BaseActionFacade {
    
    get accounts(): Signal<BaseAccount[]> {
        return this.financeStore.accounts;
    }

    get shared_accounts(): Signal<BaseAccount[]> {
        return this.financeStore.shared_accounts;
    }

    create(resource: CreateGoalDTO): Observable<BaseGoal> {
        return this.goalService.create(resource).pipe();
    }

    edit(id: string, resource: UpdateGoalDTO): Observable<BaseGoal> {
        return this.goalService.update(id, resource).pipe();
    }

    delete(id: string): Observable<BaseGoal> {
        return this.goalService.delete(id);
    }

}