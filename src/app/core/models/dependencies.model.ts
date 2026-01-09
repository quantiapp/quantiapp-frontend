import { BaseAccount } from "./base-account.model";
import { BaseGoal } from "./base-goal.model";

export interface GoalDepencendies {
    account: BaseAccount
}

export interface TransactionDependencies {
    account: BaseAccount,
    goal?: BaseGoal
}