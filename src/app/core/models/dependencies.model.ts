import { BaseAccountViewModel } from "./base-account.model";
import { BaseGoalViewModel } from "./base-goal.model";

export interface GoalDepencendies {
    account: BaseAccountViewModel
}

export interface TransactionDependencies {
    account: BaseAccountViewModel,
    goal?: BaseGoalViewModel
}