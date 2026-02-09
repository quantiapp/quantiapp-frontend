import { BaseGoal, BaseGoalViewModel } from "./base-goal.model"
import { Currency } from "./currency.model"

export interface BaseTransaction {
    id: string,
    type: 'income' | 'expense' | 'g2g' | string,
    description: string,
    notes: string,
    amount: number,
    from: 'inside' | 'outside' | string,
    date: string,
    origin_id: string | null,
    destination_id: string | null,
    origin_currency_id: string | null,
    destination_currency_id: string | null,
    origin_rate_to_base: number,
    destination_rate_to_base: number
}

export interface BaseTransactionViewModel {
    id: string,
    type: 'income' | 'expense' | 'g2g' | string,
    description: string,
    notes: string,
    amount: number,
    from: 'inside' | 'outside' | string,
    date: string,
    origin: Partial<BaseGoalViewModel> | null,
    destination: Partial<BaseGoalViewModel> | null,
    origin_currency: Currency | null,
    destination_currency: Currency | null,
    origin_rate_to_base: number,
    destination_rate_to_base: number
}

export interface BaseLastTransaction {
    amount: number,
    type?: 'income' | 'expense' | 'g2g' | string,
    from: 'inside' | 'outside' | string,
    origin_id: string | null,
    destination_id: string | null,
    origin_currency_id: string | null,
    destination_currency_id: string | null,
    origin_rate_to_base: number,
    destination_rate_to_base: number
}

export interface BaseLastTransactionViewModel {
    amount: number,
    type?: 'income' | 'expense' | 'g2g' | string,
    from: 'inside' | 'outside' | string,
    origin: Partial<BaseGoalViewModel> | null,
    destination: Partial<BaseGoalViewModel> | null,
    origin_currency: Currency | null,
    destination_currency: Currency | null,
    origin_rate_to_base: number,
    destination_rate_to_base: number
}