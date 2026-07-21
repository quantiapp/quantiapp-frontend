import { inject, Injectable } from "@angular/core";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { Currency } from "@core/models/currency.model";
import { map, Observable, tap } from "rxjs";
import { FinanceStore } from "@core/data/finance-store.data";

@Injectable({
    providedIn: 'any'
})
export class CurrencyService extends BaseResourceService<Currency> {
    private financeStore = inject(FinanceStore);

    private ensureArray(res: any): Currency[] {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        if (res && Array.isArray(res.currencies)) return res.currencies;
        if (res && Array.isArray(res.items)) return res.items;
        return [];
    }

    override getAll(): Observable<Currency[]> {
        return super.getAll('api/currencies').pipe(
            map(res => this.ensureArray(res)),
            tap((data) => this.financeStore.loadCurrencies(data))
        );
    }
}