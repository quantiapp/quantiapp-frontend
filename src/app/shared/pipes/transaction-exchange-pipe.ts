import { Pipe, PipeTransform } from '@angular/core';
import { BaseAccount } from '@core/models/base-account.model';
import { BaseGoal } from '@core/models/base-goal.model';
import { BaseTransaction } from '@core/models/base-transaction.model';

@Pipe({
  name: 'transactionExchange'
})
export class TransactionExchangePipe implements PipeTransform {

  transform(transaction: BaseTransaction, dependencies: { account: BaseAccount, goal: BaseGoal }): number {
    if(transaction.origin_currency.code === transaction.destination_currency.code) return transaction.amount;

    const valueInBaseCurrency = transaction.amount / transaction.origin_rate_to_base;
    const converted = valueInBaseCurrency * transaction.destination_rate_to_base;

    if(transaction.origin) {
      if(transaction.origin['id'] === dependencies.goal.id) return transaction.amount;
    }

    if(transaction.destination) {
      if(transaction.destination['id'] === dependencies.goal.id) return converted;
    }

    return transaction.amount;
  }

}
