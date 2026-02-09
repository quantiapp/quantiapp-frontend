import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { map, Observable, tap } from "rxjs";
import { TransactionSimulator } from "./simulator.service";
import { FinanceStore } from "@core/data/finance-store.data";

@Injectable({
    providedIn: 'root'
})
export class TransactionService extends BaseResourceService<BaseTransaction> {
    private simulator = inject(TransactionSimulator);
    private financeStore = inject(FinanceStore);

    latest(limit: number): Observable<BaseTransaction[]> {
        // return super.getAll(`/api/transactions/latest`).pipe(
        return this.simulator.latest().pipe(
            map(data => data.slice(0, limit)),
            tap((data) => this.financeStore.loadLatestTransactions(data))
        );
    }

    protected override getAll(): Observable<BaseTransaction[]> {
        // return super.getAll(`/api/transactions?filters`).pipe(
        return this.simulator.transactionsByFilter('filters').pipe(
            tap((data) => this.financeStore.loadTransactions(data))
        )
    }
}