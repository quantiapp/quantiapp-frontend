export interface CreateAccountContract {
    name: string;
    account_type_id: string;
    balance: number;
    color: string;
    currency_id: string;
    share_account: boolean;
}

export interface UpdateAccountContract {
    name?: string;
    account_type_id?: string;
    balance?: number;
    color?: string;
    currency_id?: string;
    share_account?: boolean;
}
