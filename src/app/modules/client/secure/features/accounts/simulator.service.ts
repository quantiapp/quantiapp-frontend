import { IDataSimulator } from "@core/interfaces/data-simulator.interface";
import { delay, map, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { Mockery } from "@core/abstracts/mock.abstract";
import { AccountService } from "./account.service";
import { BaseAccount } from "@core/models/base-account.model";

@Injectable({
    providedIn: 'root'
})
export class AccountSimulator extends Mockery {
    
    accounts(): Observable<BaseAccount[]> {
        return this.convertToObservable(this.MOCK_ACCOUNTS)
    }

    shared(): Observable<BaseAccount[]> {
        return this.convertToObservable(this.MOCK_SHARED_ACCOUNTS);
    }

    private convertToObservable(data: BaseAccount[]): Observable<BaseAccount[]> {
        return of(data).pipe(delay(2000));
    }

}