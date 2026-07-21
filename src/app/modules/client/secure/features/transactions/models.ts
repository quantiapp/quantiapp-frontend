import { BaseTransaction } from "@core/models/base-transaction.model"

export interface TransactionCursor {
    date: string,
    id: string
}

export interface TransactionMonthGroup {
    month: {
        label: string,
        key: string
    },
    transactions: BaseTransaction[]
}

export interface TransactionDataContract {
    data: TransactionMonthGroup[],
    next_cursor: TransactionCursor | null
}