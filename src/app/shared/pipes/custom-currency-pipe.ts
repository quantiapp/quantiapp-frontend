import { CurrencyPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { FinanceStore } from '@core/data/finance-store.data';
import { UserStore } from '@core/data/user-store.data';

@Pipe({
  name: 'money',
})
export class CustomCurrencyPipe implements PipeTransform {
  private currencyPipe = inject(CurrencyPipe);
  private userStore = inject(UserStore);
  private financeStore = inject(FinanceStore);

  transform(value: number | null | undefined, digits: string = '1.0-2'): string | null {
    if(value === null || value === undefined) return null;

    const userCurrency = this.userStore.settings()?.currency_id;
    const currencyCode = userCurrency ? this.financeStore.currenciesMap()[userCurrency].code : 'USD';

    return this.currencyPipe.transform(
      value,
      currencyCode,
      '',
      digits,
      this.userStore.settings()?.locale ?? 'en-US'
    );
  }

}
