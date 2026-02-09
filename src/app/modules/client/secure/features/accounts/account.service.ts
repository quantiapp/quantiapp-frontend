import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AccountSimulator } from "./simulator.service";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { BaseAccount } from "@core/models/base-account.model";
import { FinanceStore } from "@core/data/finance-store.data";

Injectable({
    providedIn: 'root'
})
export class AccountService extends BaseResourceService<BaseAccount>{
    private simulator = inject(AccountSimulator);
    private financeStore = inject(FinanceStore);

    override getAll(): Observable<BaseAccount[]> {
        // return super.getAll('/api/accounts').pipe(
        return this.simulator.accounts().pipe(
            tap(data => this.financeStore.loadAccounts(data))
        );
    }

    shared(): Observable<BaseAccount[]> {
        // return super.getAll('/api/accounts/shared').pipe(
        return this.simulator.shared().pipe(
            tap(data => this.financeStore.loadSharedAccounts(data))
        )
    }

    override create(resource: Omit<BaseAccount, 'id'>): Observable<BaseAccount> {
        return super.create(resource, '/api/accounts/create').pipe(
            tap(response => {
                this.financeStore.addAccount(response);
            })
        );
    }

    override update(id: string, resource: Partial<BaseAccount>): Observable<BaseAccount> {
        return super.update(id, resource, '/api/accounts/update').pipe(
            tap(response => {
                this.financeStore.updateLocalAccount(id, resource)
            })
        )
    }

    override delete(id: string): Observable<void> {
        return super.delete(id, '/api/accounts/delete').pipe(
            tap(response => {
                this.financeStore.removeLocalAccount(id);
            })
        )
    }
}