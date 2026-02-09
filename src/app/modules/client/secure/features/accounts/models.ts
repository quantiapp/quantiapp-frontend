import { ISnapshotState } from "@core/interfaces/snapshot-state.interface";
import { BaseAccount, BaseAccountViewModel } from "@core/models/base-account.model";
import { BaseGoal, BaseGoalViewModel } from "@core/models/base-goal.model";
import { BaseTransaction, BaseTransactionViewModel } from "@core/models/base-transaction.model";

export interface AccountSnapshot {
    accounts: AccountViewModel[],
    sharedAccounts: AccountViewModel[],
}

export interface AccountState extends ISnapshotState{}
export type AccountType = 'owner' | 'shared';

export interface AccountViewModel extends BaseAccountViewModel {}
export interface AccountGoalViewModel extends BaseGoalViewModel {}
export interface AccountTransactionViewModel extends BaseTransactionViewModel {}
export interface AccountTransaction extends BaseTransaction {}