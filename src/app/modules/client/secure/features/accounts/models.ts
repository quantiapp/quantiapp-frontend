import { BaseAccountViewModel } from "@core/models/base-account.model";
import { BaseGoalViewModel } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";

export interface AccountViewModel extends BaseAccountViewModel {}
export interface AccountGoalViewModel extends BaseGoalViewModel {}
export interface AccountTransaction extends BaseTransaction {}