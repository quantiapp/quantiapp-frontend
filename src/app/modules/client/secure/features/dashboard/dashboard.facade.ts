import { Injectable, signal, WritableSignal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";

@Injectable({
    providedIn: 'root'
})
export class DashboardFacade extends BaseActionFacade {
    activeAccountSg: WritableSignal<number> = signal(0);
    activeGoalSg: WritableSignal<number> = signal(0);
}