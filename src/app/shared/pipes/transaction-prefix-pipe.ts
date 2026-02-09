import { inject, Pipe, PipeTransform } from '@angular/core';
import { BaseLastTransaction, BaseTransaction } from '@core/models/base-transaction.model';

@Pipe({
  name: 'transactionPrefix'
})
export class TransactionPrefixPipe implements PipeTransform {
  transform(transaction: BaseTransaction | BaseLastTransaction): string {
    if(transaction.type && transaction.type === 'income') {
      return '+';
    }

    if(transaction.type && transaction.type === 'outcome') {
      return '-';
    }

    return '';
  }

}
