import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { Currency } from "@core/models/currency.model";
import { Observable, tap } from "rxjs";
import { CoreSimulator } from "./core.simulator.service";
import { FinanceStore } from "@core/data/finance-store.data";

@Injectable({
    providedIn: 'any'
})
export class CurrencyService extends BaseResourceService<Currency> {
    private simulator = inject(CoreSimulator);
    private financeStore = inject(FinanceStore);

    override getAll(): Observable<Currency[]> {
        // return super.getAll('/api/currencies').pipe(
        return this.simulator.currencies().pipe(
            tap((data) => this.financeStore.loadCurrencies(data))
        );
    }
}