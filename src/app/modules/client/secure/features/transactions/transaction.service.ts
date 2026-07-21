import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { map, Observable, tap } from "rxjs";
import { FinanceStore } from "@core/data/finance-store.data";
import { TransactionCursor, TransactionDataContract } from "./models";
import { CreateTransactionDTO, UpdateTransactionDTO } from "@core/dtos/transaction.dto";

@Injectable({
    providedIn: 'root'
})
export class TransactionService extends BaseResourceService<BaseTransaction> {
    private financeStore = inject(FinanceStore);

    private ensureArray(res: any): BaseTransaction[] {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        if (res && Array.isArray(res.transactions)) return res.transactions;
        if (res && Array.isArray(res.items)) return res.items;
        return [];
    }

    override create(resource: CreateTransactionDTO): Observable<BaseTransaction> {
        return super.create(resource.contract, `api/transaction/create`).pipe(
            map(res => (res as any)?.data || res),
            tap((transaction) =>  {
                if (transaction?.id) {
                    this.financeStore.addTransaction(transaction);
                }
            })
        );
    }

    override update(id: string, resource: UpdateTransactionDTO): Observable<BaseTransaction> {
        return super.update(id, resource.contract, 'api/transaction/update').pipe(
            map(res => (res as any)?.data || res),
            tap(transaction => {
                this.financeStore.updateLocalTransaction(id, transaction);
                this.financeStore.updateLocalLatestTransaction(id, transaction);
            })
        );
    }

    override delete(id: string): Observable<BaseTransaction> {
        return super.delete(id, 'api/transaction/delete').pipe(
            tap(() => {
                this.financeStore.removeLocalTransaction(id);
            })
        );
    }

    last(cursor: TransactionCursor | null, filters?: any): Observable<TransactionDataContract> {
        const params: any = { ...filters };
        if (cursor) {
            params.cursor_date = cursor.date;
            params.cursor_id = cursor.id;
        }
        return this.httpShema.get<TransactionDataContract>('api/transactions', { params });
    }

    latest(limit: number): Observable<BaseTransaction[]> {
        return super.getAll('api/transactions/latest').pipe(
            map(res => this.ensureArray(res).slice(0, limit)),
            tap((data) => this.financeStore.loadLatestTransactions(data))
        );
    }

    override getAll(): Observable<BaseTransaction[]> {
        return super.getAll('api/transactions').pipe(
            map(res => this.ensureArray(res)),
            tap((data) => this.financeStore.loadTransactions(data))
        );
    }
    
    transactionsByAccount(accountId: string): Observable<BaseTransaction[]> {
        return super.getAll(`api/accounts/${accountId}/transactions`).pipe(
            map(res => this.ensureArray(res)),
            tap((data) => this.financeStore.loadAccountTransactions(accountId, data))
        );
    }

    transactionsByGoal(goalId: string): Observable<BaseTransaction[]> {
        return super.getAll(`api/goals/${goalId}/transactions`).pipe(
            map(res => this.ensureArray(res)),
            tap((data) => this.financeStore.loadGoalTransactions(goalId, data))
        );
    }
}