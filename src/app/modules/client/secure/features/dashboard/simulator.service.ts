import { IDataSimulator } from "@core/interfaces/data-simulator.interface";
import { DashboardAccount, DashboardGoal, DashboardSnapshot, DashboardTransaction } from "./models";
import { delay, map, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { Mockery } from "@core/abstracts/mock.abstract";

@Injectable({
    providedIn: DashboardService
})
export class DashboardSimulator extends Mockery implements IDataSimulator<DashboardSnapshot> {
    
    data(): Observable<any> {
        const data: Object = {
            accounts: this.accounts,
            summary: {
                total_balance: 345343459.90,
                exchanges: {
                    user_currency: {
                        code: 'AOA'
                    },
                    conversions: [
                        {
                            from: "EUR",
                            value: 870.96
                        },
                        {
                            from: "USD",
                            value: 750.00
                        },
                        {
                            from: "BRL",
                            value: 590.05
                        }
                    ]
                }
            }
        };
        return of(data).pipe(delay(2000));
    }

    goalsByAccount(account_id: string): Observable<DashboardGoal[]> {
        return of(this.goals.filter(item => item.account.id === account_id)).pipe(delay(1000));
    }

    transactionsByGoal(goal_id: string): Observable<DashboardTransaction[]> {
        return of(this.goals.find(item => item.id === goal_id)).pipe(
            map(goal => goal?.latest_transactions ?? [])
        );
    }

}