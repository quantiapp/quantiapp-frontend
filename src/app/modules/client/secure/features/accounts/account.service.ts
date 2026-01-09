import { inject, Injectable } from "@angular/core";
import { AccountFacade } from "./account.facade";
import { HttpSchema } from "@core/services/http-schema.service";
import { Observable } from "rxjs";
import { AccountSnapshot, AccountTransaction } from "./models";
import { AccountSimulator } from "./simulator.service";

Injectable({
    providedIn: AccountFacade
})
export class AccountService{
    private simulator = inject(AccountSimulator);
    private httpSchema = inject(HttpSchema);

    get snapshot(): Observable<AccountSnapshot>{
        return this.simulator.data();
    }

    // transactionsByAccount(account_id: string): Observable<AccountTransaction[]>{
    //     return this.simulator.transactionsByAccount(account_id);
    // }
}