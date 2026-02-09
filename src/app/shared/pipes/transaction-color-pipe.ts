import { inject, Pipe, PipeTransform } from '@angular/core';
import { BaseLastTransaction, BaseTransaction } from '@core/models/base-transaction.model';

@Pipe({
  name: 'transactionColor'
})
export class TransactionColorPipe implements PipeTransform {

  private readonly COLORS = {
    debit: '#E2060A',
    credit: '#00A751',
    g2g: '#4AA4FF',
  }

  transform(transaction: BaseLastTransaction | BaseTransaction): string {
    if(transaction.type && transaction.type === 'income') {
      return this.COLORS.credit;
    }

    if(transaction.type && transaction.type === 'outcome') {
      return this.COLORS.debit;
    }

    return this.COLORS.g2g;
  }

}
