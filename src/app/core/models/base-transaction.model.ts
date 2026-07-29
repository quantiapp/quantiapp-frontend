export interface BaseTransaction {
    id: string,
    type: TransactionType,
    description: string,
    notes: string,
    register: TransactionRegister,
    amount: number,
    from: 'inside' | 'outside' | string,
    date: string,
    source: EntityReference | null,
    destination: EntityReference | null
}

export interface BaseLastTransaction {
    amount: number,
    type?: 'income' | 'outcome' | 'g2g' | string,
    from: 'inside' | 'outside' | string,
    source: EntityReference | null,
    destination: EntityReference | null,
}

export interface EntityReference {
    id: string,
    type: 'goal' | 'account',
    name: string,
    account_name: string,
    currency_id: string,
    rate_to_base: number,
    color: string,
    owner?: string
}

export interface TransactionRegister {
    email: string
}

export type TransactionType = 'income' | 'outcome' | 'g2g' | string;