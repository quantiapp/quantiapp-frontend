import { BaseAccountViewModel } from "@core/models/base-account.model";
import { BaseGoalViewModel } from "@core/models/base-goal.model";

export interface GoalAccountViewModel extends BaseAccountViewModel { }
export interface GoalViewModel extends BaseGoalViewModel { }

export type GoalInfoTab = 'general' | 'statistics';