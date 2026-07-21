import { CreateTransactionContract, UpdateTransactionContract } from "@core/contracts/transaction.contracts";
import { BaseTransaction, TransactionType } from "@core/models/base-transaction.model";

export class CreateTransactionDTO {
    private notes: string;
    private type: TransactionType;
    private amount: number;
    private source: string | null;
    private destination: string | null;
    private description: string;
    private date: string;

    public constructor(
        notes: string,
        type: TransactionType,
        amount: number,
        description: string,
        date: string,
        source: string | null,
        destination: string | null,
    ) {
        this.notes = notes;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.source = source;
        this.destination = destination;
    }

    public get contract(): CreateTransactionContract {
        return {
            notes: this.notes,
            type: this.type,
            amount: this.amount,
            date: this.date,
            source: this.source ?? null,
            destination: this.destination ?? null,
            description: this.description 
        }
    }
}

export class UpdateTransactionDTO {
    private notes?: string;
    private type?: TransactionType;
    private amount?: number;
    private source?: string | null;
    private destination?: string | null;
    private description?: string;
    private date?: string;

    public constructor(data: Partial<BaseTransaction> | {
        notes?: string;
        type?: TransactionType;
        amount?: number;
        description?: string;
        date?: string;
        source?: string | null | any;
        destination?: string | null | any;
    }) {
        this.notes = data.notes;
        this.type = data.type;
        this.amount = data.amount;
        this.description = data.description;
        this.date = data.date;
        this.source = typeof data.source === 'string' ? data.source : (data.source?.id ?? null);
        this.destination = typeof data.destination === 'string' ? data.destination : (data.destination?.id ?? null);
    }

    public get contract(): UpdateTransactionContract {
        const c: UpdateTransactionContract = {};
        if (this.notes !== undefined) c.notes = this.notes;
        if (this.type !== undefined) c.type = this.type;
        if (this.amount !== undefined) c.amount = this.amount;
        if (this.date !== undefined) c.date = this.date;
        if (this.source !== undefined) c.source = this.source;
        if (this.destination !== undefined) c.destination = this.destination;
        if (this.description !== undefined) c.description = this.description;
        return c;
    }
}