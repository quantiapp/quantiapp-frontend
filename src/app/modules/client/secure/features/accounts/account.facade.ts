import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { AccountPage } from "./account.page";
import { AccountService } from "./account.service";
import { map, Observable, of, switchMap } from "rxjs";
import { Account, AccountSnapshot, AccountState, AccountTransaction } from "./models";
import { Snapshot } from "@core/services/snapshot.service";
import { ISnapshot } from "@core/interfaces/snapshot-state.interface";

@Injectable({
    providedIn: AccountPage
})
export class AccountFacade extends Snapshot<AccountState> implements ISnapshot<AccountSnapshot> {
    private api = inject(AccountService);
    readonly activeAccount$: WritableSignal<{ index: number,  account?: Account}> = signal<{ index: number, account?: Account }>({
        index: 0
    });

    get getState(): Observable<AccountState>{
        return this.state;
    }

    get loadSnapshot(): Observable<AccountSnapshot>{
        this.state = { loading: true };
        return this.snapshot$.pipe(
            switchMap(snapshot => {
                if(!snapshot){
                    return this.api.snapshot.pipe(
                        map(snapshot => this.state = { snapshot })
                    );
                }
                return of(snapshot);
            })
        )
    }
    
    changeActiveAccount(accountIndex: number, account: Account): void {
        this.activeAccount$.set({ index: accountIndex, account });
    }

    // getTransactionsByAccount(account_id): Observable<AccountTransaction[]>{
    //     return this.api
    // }
    
}