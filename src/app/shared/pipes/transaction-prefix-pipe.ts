import { Pipe, PipeTransform } from '@angular/core';
import { DashboardAccount, DashboardGoal, DashboardTransaction } from '@client/secure/features/dashboard/models';

@Pipe({
  name: 'transactionPrefix'
})
export class TransactionPrefixPipe implements PipeTransform {

  transform(transaction: DashboardTransaction, dependencies: { account: DashboardAccount, goal: DashboardGoal }): string {
      return `${(transaction.origin?.id === dependencies.goal.id) ? '-' : '+'}`;
    }

}
