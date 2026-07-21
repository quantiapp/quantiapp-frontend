import { BaseAccountViewModel } from "./base-account.model"
import { BaseLastTransaction } from "./base-transaction.model"

export interface BaseGoal {
    id: string,
    name: string,
    description: string,
    current_amount: number,
    target_amount: number,
    excess_amount: number,
    track_progress: boolean,
    icon_key: string,
    account_id: string,
    last_transaction: BaseLastTransaction | null
}

export interface BaseGoalViewModel {
    id: string,
    name: string,
    description: string,
    current_amount: number,
    target_amount: number,
    excess_amount: number,
    track_progress: boolean,
    progress: number,
    icon_key: string,
    account: BaseAccountViewModel,
    last_transaction: BaseLastTransaction | null
}