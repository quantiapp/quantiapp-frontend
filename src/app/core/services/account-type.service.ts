import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { map, Observable, tap } from "rxjs";
import { AccountType } from "@core/models/account-type.model";
import { FinanceStore } from "@core/data/finance-store.data";

@Injectable({
    providedIn: 'any'
})
export class AccountTypeService extends BaseResourceService<AccountType> {
    private financeStore = inject(FinanceStore);

    private ensureArray(res: any): AccountType[] {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        if (res && Array.isArray(res.account_types)) return res.account_types;
        if (res && Array.isArray(res.items)) return res.items;
        return [];
    }

    override getAll(): Observable<AccountType[]> {
        return super.getAll('api/account-types').pipe(
            map(res => this.ensureArray(res)),
            tap((data) => this.financeStore.loadAccountTypes(data))
        );
    }
}