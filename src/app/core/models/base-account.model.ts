import { AccountType } from "./account-type.model"
import { Currency } from "./currency.model"

export interface BaseAccount {
    id: string,
    name: string,
    account_type_id: string,
    balance: number,
    color: string,
    currency_id: string,
    owner?: string,
    permissions?: SharedAccountPermissions
}

export interface BaseAccountViewModel {
    id: string,
    name: string,
    account_type: AccountType,
    balance: number,
    color: string,
    currency: Currency,
    owner?: string,
    can_see_balance: boolean
    can_see_goals: boolean
    can_see_transactions: boolean
}

export interface SharedAccountPermissions{
    can_see_amount: boolean,
    can_see_goals: boolean,
    can_see_transactions: boolean
}