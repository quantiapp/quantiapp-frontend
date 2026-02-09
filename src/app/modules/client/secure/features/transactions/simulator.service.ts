import { Injectable } from "@angular/core";
import { Mockery } from "@core/abstracts/mock.abstract";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { delay, Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionSimulator extends Mockery {
    latest(): Observable<BaseTransaction[]> {
        return of(this.MOCK_TRANSACTIONS).pipe(delay(2000))
    }

    transactionsByFilter(filter: any): Observable<BaseTransaction[]> {
        return of([]).pipe(delay(2000));
    }
}