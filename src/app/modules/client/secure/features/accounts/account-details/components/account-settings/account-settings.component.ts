import { Component, input, linkedSignal, output } from '@angular/core';
import { Darkable } from "@shared/directives/darkable";
import { AccountColorComponent } from "./views/account-color.component";
import { TheAccount } from '../../details.page';
import { AccountCurrencyComponent } from "./views/account-currency.component";
import { AccountTypeComponent } from "./views/account-type.component";
import { ShareAccountComponent } from "./views/share-account.component";
import { SharePermissionsComponent } from "./views/share-permissions.component";
import { DeleteAccountComponent } from './views/delete-account.component';

@Component({
  selector: 'app-account-settings',
  imports: [Darkable, AccountColorComponent, AccountCurrencyComponent, AccountTypeComponent, ShareAccountComponent, SharePermissionsComponent, DeleteAccountComponent],
  template: `
    @if(account()!.type !== 'shared'){
      <div class="panel-body flex gap-5 flex-col">
        <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Definições de Conta</h1>
  
        <div class="settings-group flex flex-col gap-2.5">
          <div class="appearence-group">
            <div class="group-fieldset py-2.5">
              <h3 class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Aparência</h3>
            </div>
            <div class="fields flex flex-col gap-3">
              <div class="color">
                <app-account-color [account]="account()"></app-account-color>
              </div>
              <div class="currency">
                <app-account-currency [account]="account()"></app-account-currency>
              </div>
              <div class="account-type">
                <app-account-type [account]="account()"></app-account-type>
              </div>
            </div>
          </div>
  
          <div class="sharing-group">
            <div class="group-fieldset py-2.5">
              <h3 class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Partilha</h3>
            </div>
            <div class="fields flex flex-col gap-3">
              <div class="share-ccount">
                <app-share-account [account]="account()" (shareAccountEmitter)="changePermissionsState($event)"></app-share-account>
              </div>
              @if(showSharePermissions()) {
                <div class="share-ccount">
                  <app-share-permissions (closeDrawerEmitter)="onCloseDrawerEventHandler($event)" [account]="account()"></app-share-permissions>
                </div>
              }
            </div>
          </div>
  
          <div class="account-group">
            <div class="group-fieldset py-2.5">
              <h3 class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Apagar conta</h3>
            </div>
            <div class="fields flex flex-col gap-3">
              <div class="delete-account">
                <app-delete-account [account]="account()!"></app-delete-account>
              </div>
            </div>
          </div>
  
        </div>
  
      </div>
    }
  `,
  styles: ``
})
export class AccountSettingsComponent {
  account = input.required<TheAccount>();
  showSharePermissions = linkedSignal(() => this.account().account.share_account);
  closeDrawerEmitter = output<boolean>();

  onCloseDrawerEventHandler(state: boolean): void {
    this.closeDrawerEmitter.emit(state);
  }

  changePermissionsState(state: boolean): void {
    this.showSharePermissions.set(state);
  }
}
