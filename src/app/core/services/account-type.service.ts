import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { Currency } from "@core/models/currency.model";
import { Observable, tap } from "rxjs";
import { CoreSimulator } from "./core.simulator.service";
import { AccountType } from "@core/models/account-type.model";
import { FinanceStore } from "@core/data/finance-store.data";

@Injectable({
    providedIn: 'any'
})
export class AccountTypeService extends BaseResourceService<AccountType> {
    private simulator = inject(CoreSimulator);
    private financeStore = inject(FinanceStore);

    override getAll(): Observable<AccountType[]> {
        // return super.getAll('/api/account-types').pipe(
        return this.simulator.accountTypes().pipe(
            tap((data) => this.financeStore.loadAccountTypes(data))
        );
    }
}