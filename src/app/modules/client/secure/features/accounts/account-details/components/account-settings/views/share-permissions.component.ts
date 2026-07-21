import { Component, computed, inject, input, output } from '@angular/core';
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { Darkable } from "@shared/directives/darkable";
import { FinanceStore } from '@core/data/finance-store.data';
import { TheAccount } from '../../../details.page';
import { RouterService } from '@core/services/router.service';

@Component({
  selector: 'app-share-permissions',
  imports: [IconContainerContainer, SubmitableButton, Darkable],
  template: `
    <div class="permissions">
      <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-stretch">
          <div class="label text-(--secondary) text-sm flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
            <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
              <app-icon-container [width]="30" [height]="30" [key]="'group'"></app-icon-container>
            </div>
            Gerir permissões
          </div>
          <div class="form-control flex items-center">
            <button
            [disabled]="isDisabled()"
            (click)="openPermissionsPage()"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-(currency:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium disabled:opacity-50"
            >
              Permissões
            </button>
          </div>
        </div>
    </div>
  `,
  styles: ``
})
export class SharePermissionsComponent {
  account = input.required<TheAccount>();
  private financeStore = inject(FinanceStore);
  private routerService = inject(RouterService);
  closeDrawerEmitter = output<boolean>();

  isDisabled = computed(() => {
    const accountId = this.account().account.id;
    return this.financeStore.accountsMap()[accountId].share_account === false;
  });

  openPermissionsPage(): void {
    if(this.isDisabled()) return;

    this.closeDrawerEmitter.emit(true);
    
    const accountId = this.account().account.id;
    this.routerService.routeTo(['/secure/accounts/show/'+ accountId +'/sharing-permissions']);
  }

}
