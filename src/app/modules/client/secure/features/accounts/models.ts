import { ISnapshotState } from "@core/interfaces/snapshot-state.interface";
import { BaseAccount } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";

export interface AccountSnapshot {
    accounts: Account[],
    sharedAccounts: Account[],
}

export interface AccountState extends ISnapshotState{}
export type AccountType = 'owner' | 'shared';

export interface Account extends BaseAccount<AccountGoal> {}
export interface AccountGoal extends BaseGoal<Account, AccountTransaction> {}
export interface AccountTransaction extends BaseTransaction<AccountGoal> {}