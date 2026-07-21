import { inject, Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { BaseAccount, TransferGoalResource } from "@core/models/base-account.model";
import { FinanceStore } from "@core/data/finance-store.data";
import { CreateAccountDTO, UpdateAccountDTO } from "@core/dtos/account.dto";

@Injectable({
    providedIn: 'root'
})
export class AccountService extends BaseResourceService<BaseAccount> {
    private financeStore = inject(FinanceStore);

    private ensureArray(res: any): BaseAccount[] {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        if (res && Array.isArray(res.accounts)) return res.accounts;
        if (res && Array.isArray(res.items)) return res.items;
        return [];
    }

    override getAll(): Observable<BaseAccount[]> {
        return super.getAll('api/accounts').pipe(
            map(res => this.ensureArray(res)),
            tap(data => this.financeStore.loadAccounts(data))
        );
    }

    shared(): Observable<BaseAccount[]> {
        return super.getAll('api/accounts/shared').pipe(
            map(res => this.ensureArray(res)),
            tap(data => this.financeStore.loadSharedAccounts(data))
        );
    }

    override create(resource: CreateAccountDTO): Observable<BaseAccount> {
        return super.create(resource.contract, 'api/accounts/create').pipe(
            map(res => (res as any)?.data || res),
            tap(response => {
                if (response?.id) {
                    this.financeStore.addAccount(response);
                }
            })
        );
    }

    override update(id: string, resource: UpdateAccountDTO): Observable<BaseAccount> {
        return super.update(id, resource.contract, 'api/accounts/update').pipe(
            tap(() => {
                this.financeStore.updateLocalAccount(id, resource.contract);
            })
        );
    }

    transferGoal(resource: TransferGoalResource): Observable<any> {
        return this.httpShema.post(`api/accounts/goals/transfer`, resource).pipe(
            tap(() => {
                this.financeStore.transferGoal(resource);
            })
        );
    }

    override delete(id: string): Observable<BaseAccount> {
        return super.delete(id, 'api/accounts/delete').pipe(
            tap(() => {
                this.financeStore.removeLocalAccount(id);
            })
        );
    }
}