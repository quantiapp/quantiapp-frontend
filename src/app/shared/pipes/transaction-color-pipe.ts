import { Pipe, PipeTransform } from '@angular/core';
import { DashboardAccount, DashboardGoal } from '@client/secure/features/dashboard/models';
import { BaseAccount } from '@core/models/base-account.model';
import { BaseGoal } from '@core/models/base-goal.model';
import { BaseTransaction } from '@core/models/base-transaction.model';
import { TransactionDependencies } from '@core/models/dependencies.model';

@Pipe({
  name: 'transactionColor'
})
export class TransactionColorPipe implements PipeTransform {

  private readonly COLORS = {
    debit: '#E2060A',
    credit: '#00A751'
  }

  transform(transaction: BaseTransaction, dependencies: TransactionDependencies): string {
    const originId = (dependencies.goal) ? transaction.origin?.['id'] : transaction.origin?.['account'].id;
    const referenceId = dependencies.goal?.id ?? dependencies.account.id
    return originId === referenceId ? this.COLORS.debit : this.COLORS.credit;
  }

}
