import { ISnapshotState } from "@core/interfaces/snapshot-state.interface";
import { BaseAccountViewModel } from "@core/models/base-account.model";
import { BaseGoalViewModel } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
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

export interface DashboardTransaction extends BaseTransaction{}