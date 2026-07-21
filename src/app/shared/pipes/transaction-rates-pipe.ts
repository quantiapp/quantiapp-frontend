import { inject, Pipe, PipeTransform } from '@angular/core';
import { FinanceStore } from '@core/data/finance-store.data';
import { BaseLastTransaction, BaseTransaction } from '@core/models/base-transaction.model';

@Pipe({
  name: 'transactionRatesPipe'
})
export class TransactionRatesPipe implements PipeTransform {

  private financeStore = inject(FinanceStore);

  transform(transaction: BaseTransaction): number {
    if(!transaction.source || !transaction.destination) return 0;
    if(this.financeStore.currenciesMap()[transaction.source.currency_id!].code === this.financeStore.currenciesMap()[transaction.destination.currency_id!].code) return 0;

    const source_rate_to_base = transaction.source.rate_to_base;
    const destination_rate_to_base = transaction.destination.rate_to_base;

    const straightRate = destination_rate_to_base / source_rate_to_base;

    return straightRate;
  }

}
