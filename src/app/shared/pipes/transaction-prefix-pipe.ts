import { Pipe, PipeTransform } from '@angular/core';
import { DashboardAccount, DashboardGoal, DashboardTransaction } from '@client/secure/features/dashboard/models';
import { BaseTransaction } from '@core/models/base-transaction.model';
import { TransactionDependencies } from '@core/models/dependencies.model';

@Pipe({
  name: 'transactionPrefix'
})
export class TransactionPrefixPipe implements PipeTransform {

  transform(transaction: BaseTransaction, dependencies: TransactionDependencies): string {
    const originId = (dependencies.goal) ? transaction.origin?.['id'] : transaction.origin?.['account'].id;
    const referenceId = dependencies.goal?.id ?? dependencies.account.id;
    
    return `${(originId === referenceId) ? '-' : '+'}`;
  }

}
