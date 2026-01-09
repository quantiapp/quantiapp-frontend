import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { map, Observable, of, switchMap, take, takeLast, tap } from "rxjs";
import { DashboardPage } from "./dashboard.page";
import { DashboardAccount, DashboardGoal, DashboardSnapshot, DashboardState, DashboardTransaction } from "./models";
import { Snapshot } from "@core/services/snapshot.service";
import { ISnapshot, ISnapshotState } from "@core/interfaces/snapshot-state.interface";

@Injectable({
    providedIn: DashboardPage
})
export class DashboardFacade extends Snapshot<DashboardState> implements ISnapshot<DashboardSnapshot> {
    private api = inject(DashboardService);
    readonly activeAccount$: WritableSignal<number> = signal(0);
    readonly activeGoal$: WritableSignal<number> = signal(0);

    get getState(): Observable<DashboardState> {
        return this.state;
    }

    get loadSnapshot(): Observable<DashboardSnapshot> {
        this.state = { loading: true };
        return this.snapshot$.pipe(
            switchMap(snapshot => {
                if(!snapshot) {
                    return this.api.loadSnapshot.pipe(
                        map(snapshot => this.state = { snapshot })
                    );
                }
                return of(snapshot);
            }),
        )
    }

    changeActiveAccount(accountIndex: number): void {
        this.activeAccount$.set(accountIndex);
        this.activeGoal$.set(0);
    }

    changeActiveGoal(goalIndex: number): void {
        this.activeGoal$.set(goalIndex);
    }

    get goals$(): Observable<DashboardGoal[]> {
        return this.snapshot$.pipe(
            take(1),
            switchMap(snapshot => {
                const theAccount = this.theAccount(snapshot);

                if(!(theAccount.goals.length > 0)) {
                    return this.api.getAccountGoals(theAccount.id).pipe(
                        map(goals => {
                            theAccount.goals = [ ...goals ];
                            this.state = { ...snapshot };
                            return goals;
                        })
                    );
                }
                return of(theAccount.goals);
            })
        )
    }
    
    get transactions$(): Observable<DashboardTransaction[]> {
        return this.snapshot$.pipe(
            take(1),
            switchMap(snapshot => {
                const theAccount = this.theAccount(snapshot);
                const theGoal = theAccount.goals[this.activeGoal$()];

                if(!(theGoal.latest_transactions.length > 0)){
                    return this.api.getGoalsTransactions(theGoal.id).pipe(
                        map(transactions => {
                            theGoal.latest_transactions = [ ...transactions ];
                            console.log(theGoal)
                            this.state = { ...snapshot };
                            return transactions;
                        })
                    );
                }

                return of(theGoal.latest_transactions);
            })
        );
    }

    theAccount(snapshot: any): any {
        const theAccount = snapshot?.accounts[this.activeAccount$()];

        return (!theAccount) ? [] : theAccount; 
    }

}