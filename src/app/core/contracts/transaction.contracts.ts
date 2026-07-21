import { TransactionType } from "@core/models/base-transaction.model"

export interface CreateTransactionContract {
    notes: string,
    type: TransactionType,
    amount: number,
    date: string,
    source: string | null,
    destination: string | null,
    description: string 
}

export interface UpdateTransactionContract {
    notes?: string;
    type?: TransactionType;
    amount?: number;
    date?: string;
    source?: string | null;
    destination?: string | null;
    description?: string;
}