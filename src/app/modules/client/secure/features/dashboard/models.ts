import { ISnapshotState } from "@core/interfaces/snapshot-state.interface";
import { BaseAccount, BaseAccountViewModel } from "@core/models/base-account.model";
import { BaseGoal, BaseGoalViewModel } from "@core/models/base-goal.model";
import { BaseTransaction, BaseTransactionViewModel } from "@core/models/base-transaction.model";
import { Currency } from "@core/models/currency.model";

export interface DashboardSnapshot {
    accounts: DashboardAccountViewModel[]
    summary: DashboardSummary
}

export interface Conversion {
    from: string,
    value: number
}

export interface DashboardSummary {
    total_balance: number,
    exchanges: {
        user_currency: Partial<Currency>,
        conversions: Conversion[]
    }
}

export interface DashboardState extends ISnapshotState {}

export interface DashboardAccountViewModel extends BaseAccountViewModel {}

export interface DashboardGoalViewModel extends BaseGoalViewModel{}

export interface DashboardTransactionViewModel extends BaseTransactionViewModel{}
export interface DashboardTransaction extends BaseTransaction{}