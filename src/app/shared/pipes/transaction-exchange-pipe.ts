import { inject, Pipe, PipeTransform } from '@angular/core';
import { FinanceStore } from '@core/data/finance-store.data';
import { BaseLastTransaction, BaseTransaction } from '@core/models/base-transaction.model';

@Pipe({
  name: 'transactionExchange'
})
export class TransactionExchangePipe implements PipeTransform {

  private financeStore = inject(FinanceStore);

  transform(transaction: BaseTransaction | BaseLastTransaction): number {

    if(!transaction.origin_id || !transaction.destination_id) return transaction.amount;
    if(this.financeStore.mappedCurrencies()[transaction.origin_currency_id!].code === this.financeStore.mappedCurrencies()[transaction.destination_currency_id!].code) return transaction.amount;

    const valueInBaseCurrency = transaction.amount / transaction.origin_rate_to_base;
    const converted = valueInBaseCurrency * transaction.destination_rate_to_base;

    return converted;
  }

}
