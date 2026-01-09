import { inject, Injectable } from "@angular/core";
import { HttpSchema } from "@core/services/http-schema.service";
import { Observable } from "rxjs";
import { DashboardFacade } from "./dashboard.facade";
import { DashboardSimulator } from "./simulator.service";
import { DashboardGoal, DashboardSnapshot, DashboardTransaction } from "./models";

@Injectable({
    providedIn: DashboardFacade
})
export class DashboardService {
    private simulator = inject(DashboardSimulator);
    private httpSchema = inject(HttpSchema);

    get loadSnapshot(): Observable<DashboardSnapshot> {
        return this.simulator.data();
    }

    getAccountGoals(id: string): Observable<DashboardGoal[]> {
        return this.simulator.goalsByAccount(id);
    }

    getGoalsTransactions(id: string): Observable<DashboardTransaction[]> {
        return this.simulator.transactionsByGoal(id);
    }
}