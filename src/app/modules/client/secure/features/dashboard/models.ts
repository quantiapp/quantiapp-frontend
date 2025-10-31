import { ISnapshotState } from "@core/interfaces/snapshot-state.interface";
import { AccountSettings } from "@core/models/account-settings.model";
import { AccountType } from "@core/models/account-type.model";
import { BaseAccount } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { Currency } from "@core/models/currency.model";
import { Icon } from "@core/models/icon.model";

export interface DashboardSnapshot {
    accounts: DashboardAccount[]
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

export interface DashboardAccount extends BaseAccount<DashboardGoal> {}

export interface DashboardGoal extends BaseGoal<DashboardAccount, DashboardTransaction>{}

export interface DashboardTransaction extends BaseTransaction<DashboardGoal>{}