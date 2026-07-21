import { CreateAccountContract, UpdateAccountContract } from "@core/contracts/account.contracts";
import { BaseAccount } from "@core/models/base-account.model";

export class CreateAccountDTO {
    private name: string;
    private account_type_id: string;
    private balance: number;
    private color: string;
    private currency_id: string;
    private share_account: boolean;

    public constructor(
        name: string,
        account_type_id: string,
        balance: number,
        color: string,
        currency_id: string,
        share_account: boolean
    ) {
        this.name = name;
        this.account_type_id = account_type_id;
        this.balance = balance;
        this.color = color;
        this.currency_id = currency_id;
        this.share_account = share_account;
    }

    public get contract(): CreateAccountContract {
        return {
            name: this.name,
            account_type_id: this.account_type_id,
            balance: this.balance,
            color: this.color,
            currency_id: this.currency_id,
            share_account: this.share_account
        };
    }
}

export class UpdateAccountDTO {
    private name?: string;
    private account_type_id?: string;
    private balance?: number;
    private color?: string;
    private currency_id?: string;
    private share_account?: boolean;

    public constructor(data: Partial<BaseAccount>) {
        this.name = data.name;
        this.account_type_id = data.account_type_id;
        this.balance = data.balance;
        this.color = data.color;
        this.currency_id = data.currency_id;
        this.share_account = data.share_account;
    }

    public get contract(): UpdateAccountContract {
        const c: UpdateAccountContract = {};
        if (this.name !== undefined) c.name = this.name;
        if (this.account_type_id !== undefined) c.account_type_id = this.account_type_id;
        if (this.balance !== undefined) c.balance = this.balance;
        if (this.color !== undefined) c.color = this.color;
        if (this.currency_id !== undefined) c.currency_id = this.currency_id;
        if (this.share_account !== undefined) c.share_account = this.share_account;
        return c;
    }
}
