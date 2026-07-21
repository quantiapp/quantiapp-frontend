import { Injectable, Signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { AccountType } from "@core/models/account-type.model";
import { AccountAccess, BaseAccount, TransferGoalResource } from "@core/models/base-account.model";
import { Currency } from "@core/models/currency.model";
import { Observable } from "rxjs";
import { CreateAccountDTO, UpdateAccountDTO } from "@core/dtos/account.dto";

@Injectable({
    providedIn: 'root'
})
export class AccountFacade extends BaseActionFacade {
    get accountTypes(): Signal<AccountType[]> {
        return this.financeStore.accountTypes;
    }

    get currencies(): Signal<Currency[]> {
        return this.financeStore.currencies;
    }

    create(account: CreateAccountDTO): Observable<BaseAccount> {
        return this.accountService.create(account);
    }

    transferGoal(resource: TransferGoalResource): Observable<any> {
        return this.accountService.transferGoal(resource)
    }

    edit(id: string, resource: UpdateAccountDTO): Observable<BaseAccount> {
        return this.accountService.update(id, resource);
    }

    delete(id: string): Observable<BaseAccount> {
        return this.accountService.delete(id);
    }
}