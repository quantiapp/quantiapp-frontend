import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AccountAccess } from "@core/models/base-account.model";
import { FinanceStore } from "@core/data/finance-store.data";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { User } from "@core/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AccountShareService extends BaseResourceService<AccountAccess> {
    private financeStore = inject(FinanceStore);

    adduserAccess(data: AccountAccess): Observable<AccountAccess> {
        return super.create(data, `api/account/sharing/new-user`).pipe(
            tap(() => {
                this.financeStore.addLocalShareUser(data);
            })
        );
    }

    updateUserPermissions(data: AccountAccess): Observable<AccountAccess> {
        return super.update(data.id, { user: data.user, permissions: data.permissions }, 'api/account/sharing/update').pipe(
            tap(() => {
                this.financeStore.updateLocalShareUser(data);
            })
        );
    }

    accountAccess(account_id: string): Observable<AccountAccess[]> {
        return this.httpShema.get<AccountAccess[]>(`api/accounts/${account_id}/sharing`).pipe(
            tap(data => {
                this.financeStore.loadAccountShare({ [account_id]: data });
            })
        );
    }

    findUser(user_key: string): Observable<User> {
        return this.httpShema.post<User>(`api/account/sharing/find-user`, { user_key });
    }

    removeUser(id: string, account_id: string): Observable<any> {
        return super.delete(id, 'api/account/sharing/unshare').pipe(
            tap(() => {
                this.financeStore.removeLocalShareUser(id, account_id);
            })
        );
    }
}