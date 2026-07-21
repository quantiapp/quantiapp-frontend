import { delay, Observable, of, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Mockery } from "@core/abstracts/mock.abstract";
import { AccountAccess, BaseAccount } from "@core/models/base-account.model";
import { User } from "@core/models/user.model";
import { HttpStatusCode } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AccountSimulator extends Mockery {
    
    accounts(): Observable<BaseAccount[]> {
        return this.convertToObservable(this.MOCK_ACCOUNTS)
    }

    shared(): Observable<BaseAccount[]> {
        return this.convertToObservable(this.MOCK_SHARED_ACCOUNTS);
    }

    accountAccess(account_id: string): Observable<AccountAccess[]> {
        return this.convertToObservable(
            this.MOCK_SHARING_ACCOUNTS[account_id]
        );
    }

    findUserByKey(user_key: string): Observable<User> {
        // o user não poderá pesquisar pela sua própria chave.
        const setting = this.MOCK_USERS_SETTINGS.find(setting => setting.sharingKey === user_key);

        if(!setting) return throwError(() => ({ status: 'Not found', code: HttpStatusCode.NotFound})).pipe(delay(2000));
        
        return this.convertToObservable(this.MOCK_USERS.find(user => user.id === setting?.sharingKey));
    }

    private convertToObservable(data: any): Observable<any> {
        return of(data).pipe(delay(2000));
    }

}