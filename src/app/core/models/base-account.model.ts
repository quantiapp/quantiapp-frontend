import { AccountType } from "./account-type.model"
import { Currency } from "./currency.model"
import { User } from "./user.model"

export interface BaseAccount {
    id: string,
    name: string,
    account_type_id: string,
    balance: number,
    color: string,
    currency_id: string,
    share_account: boolean,
    owner?: string,
    permissions?: ShareAccountPermissions
}

export interface BaseAccountViewModel {
    id: string,
    name: string,
    account_type: AccountType,
    balance: number,
    color: string,
    share_account: boolean,
    currency: Currency,
    owner?: string,
    can_see_balance: boolean
    can_see_goals: boolean
    can_see_transactions: boolean,
    income_transaction: boolean,
    outcome_transaction: boolean
}

export interface ShareAccountPermissions {
    can_see_amount: boolean,
    can_see_goals: boolean, // removable
    can_see_transactions: boolean, // removable
    income_transaction: boolean,
    outcome_transaction: boolean
}

export type AccountShare = Record<string, AccountAccess[]>;

/**
 * @id reference to the account id
 * @user reference to the user who the account is shared
 * @permissions reference to the permissions user has in shared account
 */
export interface AccountAccess {
    id: string,
    user: User,
    permissions: ShareAccountPermissions
}

/**
 * @source_account current owner of the goal
 * @goal goal id to be transfered
 * @destination_account destination account to the goal
 */
export type TransferGoalResource = {
    source_account: string,
    goal: string,
    destination_account: string
}