import { Pipe, PipeTransform } from '@angular/core';
import { BaseAccount } from '@core/models/base-account.model';
import { BaseGoal } from '@core/models/base-goal.model';
import { BaseTransaction } from '@core/models/base-transaction.model';
import { TransactionDependencies } from '@core/models/dependencies.model';

@Pipe({
  name: 'transactionExchange'
})
export class TransactionExchangePipe implements PipeTransform {

  transform(transaction: BaseTransaction, dependencies: TransactionDependencies): number {
    if(transaction.origin_currency.code === transaction.destination_currency.code) return transaction.amount;

    const valueInBaseCurrency = transaction.amount / transaction.origin_rate_to_base;
    const converted = valueInBaseCurrency * transaction.destination_rate_to_base;

    if(transaction.origin) {

      const originId = (dependencies.goal) ? transaction.origin['id'] : transaction.origin['account'].id;
      const referenceId = dependencies.goal?.id ?? dependencies.account.id;

      if(originId === referenceId) return transaction.amount;
    }

    if(transaction.destination) {
      const destinationId = (dependencies.goal) ? transaction.destination['id'] : transaction.destination['account'].id;
      const referenceId = dependencies.goal?.id ?? dependencies.account.id;

      if(destinationId === referenceId) return converted;
    }

    return transaction.amount;
  }

}
