import { inject, Pipe, PipeTransform } from '@angular/core';
import { FinanceStore } from '@core/data/finance-store.data';
import { BaseLastTransaction, BaseTransaction } from '@core/models/base-transaction.model';

@Pipe({
  name: 'transactionExchange'
})
export class TransactionExchangePipe implements PipeTransform {

  private financeStore = inject(FinanceStore);

  transform(transaction: BaseTransaction | BaseLastTransaction): number {
    if(!transaction.source || !transaction.destination) return transaction.amount;
    if(this.financeStore.currenciesMap()[transaction.source.currency_id!].code === this.financeStore.currenciesMap()[transaction.destination.currency_id!].code) return transaction.amount;

    const valueInBaseCurrency = transaction.amount / transaction.source.rate_to_base;
    const converted = valueInBaseCurrency * transaction.destination.rate_to_base;

    return converted;
  }

}
