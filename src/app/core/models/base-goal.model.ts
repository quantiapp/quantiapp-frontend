import { Icon } from "./icon.model";

export interface BaseGoal<ACCOUNT_T = any, TRANSACTION_T = any> {
    id: string,
    name: string,
    description: string,
    amount: number,
    achievement: number,
    excess_amount: number,
    progress: number,
    icon: Icon,
    account: Partial<ACCOUNT_T>,
    latest_transactions: TRANSACTION_T[]
}