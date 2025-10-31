import { AccountSettings } from "./account-settings.model";
import { AccountType } from "./account-type.model";

export interface BaseAccount<GOAL_T = any> {
    id: string,
    name: string,
    type: AccountType,
    amount: number,
    goals: GOAL_T[],
    settings: AccountSettings
}