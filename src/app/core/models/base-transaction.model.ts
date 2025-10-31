import { Currency } from "./currency.model";

export interface BaseTransaction<GOAL_T = any> {
    id: string,
    type: 'income' | 'expense' | 'g2g' | string,
    description: string,
    notes: string,
    amount: number,
    from: 'inside' | 'outside' | string,
    date: {
        long: string,
        short: string,
        original: string
    },
    origin: Partial<GOAL_T> | null,
    destination: Partial<GOAL_T> | null,
    origin_currency: Partial<Currency>,
    destination_currency: Partial<Currency>,
    origin_rate_to_base: number,
    destination_rate_to_base: number
}