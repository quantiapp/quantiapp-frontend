import { Injectable } from "@angular/core";
import { Mockery } from "@core/abstracts/mock.abstract";
import { AccountType } from "@core/models/account-type.model";
import { Currency } from "@core/models/currency.model";
import { UserSetting } from "@core/models/user-settings.model";
import { User } from "@core/models/user.model";
import { delay, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CoreSimulator extends Mockery {

    user(): Observable<User> {
        return of(this.MOCK_USER).pipe(delay(2000));
    }

    userSettings(): Observable<UserSetting> {
        return of(this.MOCK_USER_SETTINGS).pipe(delay(2000));
    }

    currencies(): Observable<Currency[]> {
        return of(this.MOCK_CURRENCIES).pipe(delay(2000));
    }

    accountTypes(): Observable<AccountType[]> {
        return of(this.MOCK_ACCOUNT_TYPES).pipe(delay(2000));
    }
}