import { Component, inject, input, signal } from '@angular/core';
import { Darkable } from '@shared/directives/darkable';
import { SubmitableButton } from "@shared/directives/submitable-button";
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { TheAccount } from '../../../details.page';
import { PopupService } from '@core/services/pop-up.service';
import { AccountFacade } from '@client/secure/features/accounts/account.facade';
import { finalize } from 'rxjs';
import { RouterService } from '@core/services/router.service';

@Component({
  selector: 'app-delete-account',
  imports: [SubmitableButton, BarSpinnerUi, Darkable],
  template: `
    <div class="permissions flex flex-col items-end gap-1.5">
      <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-stretch">
          <div class="label text-(--secondary) text-sm flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
            <div class="icon p-2.5 w-fit rounded-[10px]">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.4643 25.5H7.53623C6.77066 25.533 6.01006 25.3616 5.33253 25.0037C4.65498 24.6457 4.08488 24.114 3.68062 23.4631C3.27636 22.8121 3.05252 22.0652 3.03206 21.2993C3.01161 20.5332 3.19529 19.7757 3.56423 19.104L11.0282 6.132C11.442 5.44895 12.025 4.88417 12.7208 4.49217C13.4165 4.10018 14.2016 3.89423 15.0002 3.89423C15.7988 3.89423 16.5839 4.10018 17.2797 4.49217C17.9755 4.88417 18.5585 5.44895 18.9723 6.132L26.4363 19.104C26.8052 19.7757 26.9889 20.5332 26.9684 21.2993C26.948 22.0652 26.7242 22.8121 26.3199 23.4631C25.9156 24.114 25.3454 24.6457 24.6679 25.0037C23.9903 25.3616 23.2298 25.533 22.4643 25.5Z" stroke="#FF383C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.657 20.58C13.657 20.4025 13.6921 20.2267 13.7604 20.0629C13.8287 19.899 13.9288 19.7503 14.0549 19.6254C14.1809 19.5005 14.3305 19.4017 14.4949 19.3349C14.6595 19.268 14.8354 19.2344 15.013 19.236C15.2748 19.2408 15.5295 19.3225 15.7451 19.4712C15.9606 19.6199 16.1277 19.8289 16.2252 20.0719C16.3227 20.315 16.3463 20.5814 16.2933 20.8379C16.2401 21.0943 16.1125 21.3294 15.9265 21.5138C15.7405 21.6982 15.5043 21.8236 15.2473 21.8744C14.9904 21.9253 14.7243 21.8993 14.4821 21.7996C14.2398 21.7 14.0325 21.5311 13.8857 21.3142C13.7389 21.0973 13.6594 20.842 13.657 20.58ZM14.089 17.304L13.921 11.04C13.905 10.8894 13.9209 10.7372 13.9677 10.5932C14.0143 10.4491 14.0908 10.3165 14.1921 10.204C14.2933 10.0914 14.4172 10.0014 14.5554 9.93977C14.6938 9.87816 14.8435 9.84631 14.995 9.84631C15.1464 9.84631 15.2962 9.87816 15.4344 9.93977C15.5728 10.0014 15.6965 10.0914 15.7978 10.204C15.8991 10.3165 15.9756 10.4491 16.0223 10.5932C16.069 10.7372 16.0849 10.8894 16.069 11.04L15.913 17.304C15.913 17.5458 15.8169 17.7779 15.6459 17.9489C15.4747 18.1199 15.2428 18.216 15.001 18.216C14.7591 18.216 14.5271 18.1199 14.3561 17.9489C14.1851 17.7779 14.089 17.5458 14.089 17.304Z" fill="#FF383C"/>
              </svg>
            </div>
            Ao excluir esta conta também removerá todas as metas, definições e partilhas
          </div>
        </div>
        <button
          type="submit"
          (click)="delete()"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-[#FF252A]/60"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(255,37,42,25%)]"
          class="w-full text-sm border border-[#B6070B]/40 rounded-[0.563rem] px-2.5 text-center py-1.5 font-medium"
          [disabled]="isDeletingAccount()">
            @if(isDeletingAccount()) {
              <app-bar-spinner></app-bar-spinner>
            } @else {
              Eliminar conta
            }
        </button>
    </div>
  `,
  styles: ``
})
export class DeleteAccountComponent {
  isDeletingAccount = signal<boolean>(false);
  account = input.required<TheAccount>();
  private accountFacade = inject(AccountFacade);
  private router = inject(RouterService);

  delete(): void {
    if(this.isDeletingAccount()) return;

    PopupService.confirm(
      "Ao remover esta conta irá remover também todos os seus dados. Deseja continuar mesmo assim?",
      () => this.onConfirm()
    );
  }

  private onConfirm(): void {
    this.isDeletingAccount.set(true);
    this.accountFacade.delete(this.account().account.id).pipe(finalize(() => this.isDeletingAccount.set(false))).subscribe({
      next: response => {
        PopupService.success("Conta: " + this.account().account.name + " removida com êxito.");
        this.router.routeTo(['/secure/accounts/show', this.account().account.id, 'finance']);
      },
      error: error => {}
    })
  }
}
