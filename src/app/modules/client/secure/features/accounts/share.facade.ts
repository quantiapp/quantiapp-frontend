import { inject, Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { AccountAccess } from "@core/models/base-account.model";
import { AccountShareService } from "./share.service";
import { User } from "@core/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AccountShareFacade {
    private shareService = inject(AccountShareService);
    isLoadingShareInformations = signal<boolean>(false);

    addUserAccess(data: AccountAccess): Observable<AccountAccess> {
        return this.shareService.adduserAccess(data).pipe();
    }

    updateUserPermissions(data: AccountAccess): Observable<AccountAccess> {
        return this.shareService.updateUserPermissions(data).pipe();
    }

    accountAccess(account_id: string): Observable<AccountAccess[]> {
        return this.shareService.accountAccess(account_id);
    }

    findUserByKey(user_key: string): Observable<User> {
        return this.shareService.findUser(user_key).pipe();
    }

    removeUser(id: string, account_id: string): Observable<any> {
        return this.shareService.removeUser(id, account_id).pipe();
    }
}