import { Injectable, Signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { TransactionCursor, TransactionDataContract } from "./models";
import { Observable } from "rxjs";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { BaseAccount } from "@core/models/base-account.model";
import { CreateTransactionDTO, UpdateTransactionDTO } from "@core/dtos/transaction.dto";

@Injectable({
    providedIn: 'root'
})
export class TransactionFacade extends BaseActionFacade {
    
    get shared_accounts(): Signal<BaseAccount[]> {
        return this.financeStore.shared_accounts;
    }

    get accounts(): Signal<BaseAccount[]> {
        return this.financeStore.accounts;
    }

    last(cursor: TransactionCursor | null, filters?: any): Observable<TransactionDataContract> {
        return this.transactionService.last(cursor, filters);
    }

    create(resource: CreateTransactionDTO): Observable<BaseTransaction> {
        return this.transactionService.create(resource);
    }

    update(id: string, resource: UpdateTransactionDTO): Observable<BaseTransaction> {
        return this.transactionService.update(id, resource);
    }

    delete(id: string): Observable<BaseTransaction> {
        return this.transactionService.delete(id);
    }

}