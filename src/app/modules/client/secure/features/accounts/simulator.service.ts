import { IDataSimulator } from "@core/interfaces/data-simulator.interface";
import { delay, map, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { Mockery } from "@core/abstracts/mock.abstract";
import { AccountGoal, AccountSnapshot, AccountTransaction, AccountType } from "./models";
import { AccountService } from "./account.service";

@Injectable({
    providedIn: AccountService
})
export class AccountSimulator extends Mockery implements IDataSimulator<AccountSnapshot> {
    
    data(): Observable<AccountSnapshot> {
        const data: AccountSnapshot = {
            accounts: this.accounts,
            sharedAccounts: this.shared_accounts,
        };
        return of(data).pipe(delay(2000));
    }

    transactionsByAccount(account_id: string, reference: AccountType): Observable<AccountTransaction[]> {
        return of(this.accounts.find(item => item.id === account_id)).pipe(
            map(account => {
                const goals: AccountGoal[] = account?.goals ?? [];
                const transactions: AccountTransaction[] = goals.flatMap(g => g.latest_transactions);
                return transactions;
            })
        );
    }

}