import { Component, DestroyRef, inject, input, model, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseAccount } from '@core/models/base-account.model';
import { HeroUi } from "@shared/ui/hero/hero.ui";
import { DialogComponent } from "@shared/components/dialog.component";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PopupService } from '@core/services/pop-up.service';
import { Darkable } from "@shared/directives/darkable";
import { AccountFacade } from '../../../account.facade';
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { finalize } from 'rxjs';
import { TheAccount } from '../../details.page';
import { DrawerComponent } from "@shared/components/drawer.component";
import { AccountSettingsComponent } from "../account-settings/account-settings.component";
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency-pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransferGoalComponent } from "../transfer-goal/transfer-goal.component";
import { UpdateAccountDTO } from '@core/dtos/account.dto';
import { CreateTransactionComponent } from '@client/secure/features/transactions/components/create-transaction/create-transaction.component';

@Component({
  selector: 'app-account-hero',
  imports: [HeroUi, RouterLink, DialogComponent, SubmitableButton, ReactiveFormsModule, Darkable, BarSpinnerUi, DrawerComponent, AccountSettingsComponent, CustomCurrencyPipe, TransferGoalComponent, CreateTransactionComponent],
  template: `
    <app-hero>
      <div class="account-details flex flex-col items p-4">
        <div class="account-name w-full flex gap-2.5 justify-center items-center">
          <h1 class="text-2xl font-medium">
            {{ account().account.name }}
          </h1>
          @if(!account().account.owner){
            <q-dialog>
              <ng-template #invoker let-open="open">
                <button (click)="open()" class="badge cursor-pointer bg-white text-(--secondary) text-xs border border-(--primary) rounded-[5px] px-2 py-1 font-medium">
                  Editar
                </button>
              </ng-template>
              <ng-template #panel let-closeDialogFn="close">
                <div class="dialog-panel flex flex-col gap-6 p-4">
                  <div class="dialog-header">
                    <h1 class="text-base font-medium text-(--secondary) text-left" appDarkable="dark:text-(--dm-secondary)">Editar nome da conta</h1>
                  </div>
                  <div class="dialog-body flex flex-col gap-6">
                    <form [formGroup]="editAccountNameFormGroup" class="edit-account-name flex flex-col gap-5">
                      <div class="form-control flex flex-col gap-2.5">
                        <label for="#account_name" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Nome da Conta</label>
                        <input type="text"
                        id="account_name"
                        class="bg-[#FAFAFA] text-sm border border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
                        formControlName="accountName" placeholder="Banco Quantum" >
                      </div>
                    </form>
                  </div>
                  <div class="dialog-footer flex gap-3 justify-end items-center">
                    <button (click)="onCancel(closeDialogFn)"
                    class="w-fit text-sm text-(--secondary)/60 border border-(--secondary)/60 dark:border-(--dm-secondary)/60 rounded-[0.563rem] px-2 py-1 font-medium"
                    appDarkable="dark:text-(--dm-secondary)/60"
                    >
                      Cancelar
                    </button>
                    <button
                    [disabled]="isDisabled()"
                    (click)="submit(closeDialogFn)"
                    appSubmitableButton
                    tailwindClassBackgroundColor="bg-(color:--primary)/63"
                    tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                    class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium">
                      @if(isEditingAccount()){
                        <app-bar-spinner></app-bar-spinner>
                      } @else {
                        Submeter
                      } 
                    </button>
                  </div>
                </div>
              </ng-template>
            </q-dialog>
          }

        </div>
        <div class="account-type mt-2">
          <p class="text-base text-(--secondary) font-medium text-center capitalize">
            {{ account().account.account_type.description }} - {{ account().account.currency.code }}
          </p>
        </div>
        @if (account().account.owner) {
          <div class="account-owner mt-1">
            <p class="text-sm text-(--secondary)/90 font-semibold text-center capitalize">
              Proprietário: {{ account().account.owner }}
            </p>
          </div>
        }
        <div class="account-balance w-fit mx-auto mt-4 relative">
          <p class=" text-[2rem] text-(--secondary) font-bold value-text-shadow text-center">
            {{ account().account.can_see_balance ? (account()!.account.balance | money ) : '**********,00' }}
          </p>
        </div>
      </div>
      
      <div class="account-actions bg-white w-full mt-[2.375rem] rounded-2xl px-[1.875rem] py-4 flex gap-6 justify-center items-center"
      appDarkable="dark:bg-(--dm-bg)"
      >
        
        <div class="add">
          <button (click)="openCreateTransactionDrawer.set(true)" class="text-sm flex gap-1 flex-col items-center text-(--secondary)"
          appDarkable="dark:text-(--dm-secondary)"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6667 16H16M16 16H21.3333M16 16V21.3333M16 16V10.6667M16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16C28 22.6274 22.6274 28 16 28Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Adicionar
          </button>
        </div>
        @if(!account().account.owner){
          <div class="transfer">
            <button (click)="openTransferGoalDrawerFn()" class="text-sm flex gap-1 flex-col items-center text-(--secondary)"
            appDarkable="dark:text-(--dm-secondary)">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.3334 17.3333L25.3334 21.3333M25.3334 21.3333L21.3334 25.3333M25.3334 21.3333H6.66675M10.6667 14.6667L6.66675 10.6667M6.66675 10.6667L10.6667 6.66667M6.66675 10.6667H25.3334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Transferir meta
            </button>
          </div>
          <div class="transfer">
            <button (click)="openAccountSettingsDrawerFn()" class="text-sm flex gap-1 flex-col items-center text-(--secondary)"
            appDarkable="dark:text-(--dm-secondary)">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.1333 11.8972L26.645 11.6256C26.5691 11.5834 26.5319 11.5623 26.4952 11.5403C26.1311 11.3222 25.8242 11.0208 25.6003 10.6603C25.5777 10.624 25.5565 10.586 25.5131 10.5108C25.4697 10.4357 25.4477 10.3976 25.4275 10.36C25.2266 9.98488 25.118 9.56687 25.1115 9.14141C25.1108 9.09864 25.111 9.05494 25.1124 8.96806L25.122 8.40104C25.1372 7.49367 25.1449 7.03858 25.0174 6.63016C24.9041 6.26738 24.7146 5.93323 24.4616 5.64967C24.1755 5.32913 23.7796 5.10046 22.987 4.64368L22.3286 4.26427C21.5381 3.80877 21.1427 3.58094 20.7231 3.49409C20.3518 3.41725 19.9687 3.42081 19.5988 3.50386C19.1813 3.59758 18.7909 3.83135 18.0105 4.29861L18.0061 4.30073L17.5343 4.58321C17.4597 4.62788 17.4219 4.65039 17.3846 4.67118C17.0135 4.87747 16.5993 4.99154 16.175 5.00516C16.1322 5.00653 16.0887 5.00653 16.0017 5.00653C15.9153 5.00653 15.8699 5.00653 15.8273 5.00516C15.402 4.99148 14.987 4.87679 14.6153 4.66965C14.5779 4.64877 14.5408 4.62608 14.4661 4.5812L13.9913 4.29617C13.2056 3.82448 12.8122 3.58828 12.3924 3.49409C12.0209 3.41075 11.6365 3.40845 11.2639 3.48628C10.8431 3.57416 10.4477 3.80367 9.65678 4.26271L9.65326 4.26427L9.00304 4.64165L8.99585 4.64605C8.21206 5.10095 7.81921 5.32896 7.5356 5.64818C7.28391 5.93146 7.09579 6.26508 6.9832 6.6269C6.85592 7.03588 6.86271 7.49195 6.87804 8.40359L6.88757 8.96981C6.88901 9.05555 6.89151 9.09816 6.89089 9.14033C6.88458 9.56665 6.77448 9.98552 6.57299 10.3613C6.55307 10.3984 6.5316 10.4356 6.48872 10.5098C6.44581 10.5841 6.42503 10.6211 6.40278 10.6569C6.17782 11.0194 5.86952 11.3225 5.50311 11.541C5.46687 11.5626 5.42867 11.5834 5.35362 11.6249L4.87153 11.8921C4.06944 12.3366 3.66849 12.559 3.37674 12.8756C3.11864 13.1556 2.92367 13.4878 2.80465 13.8496C2.67012 14.2585 2.67023 14.717 2.67231 15.6341L2.67402 16.3836C2.67609 17.2945 2.67892 17.7496 2.81376 18.1558C2.93305 18.5151 3.1266 18.8453 3.38325 19.1236C3.67335 19.4383 4.07032 19.6593 4.86632 20.1022L5.34411 20.368C5.42542 20.4132 5.46634 20.4355 5.50555 20.4591C5.86864 20.6778 6.17452 20.9801 6.39757 21.3404C6.42167 21.3794 6.4448 21.4198 6.49106 21.5006C6.53675 21.5804 6.56012 21.6203 6.58125 21.6603C6.77681 22.0306 6.88152 22.442 6.88866 22.8606C6.88943 22.9059 6.88877 22.9516 6.88722 23.0436L6.87804 23.5869C6.8626 24.5017 6.85587 24.9596 6.9839 25.3697C7.09716 25.7325 7.28646 26.0666 7.5395 26.3502C7.82554 26.6708 8.22207 26.8993 9.01476 27.3561L9.67304 27.7354C10.4635 28.1909 10.8586 28.4185 11.2783 28.5053C11.6495 28.5822 12.0329 28.5792 12.4028 28.4961C12.8209 28.4023 13.2126 28.1677 13.9952 27.6991L14.467 27.4166C14.5416 27.3719 14.5794 27.3495 14.6168 27.3287C14.9879 27.1224 15.4016 27.0078 15.826 26.9942C15.8687 26.9928 15.9122 26.9928 15.9992 26.9928C16.0864 26.9928 16.1298 26.9928 16.1727 26.9942C16.5979 27.0078 17.0142 27.1229 17.3859 27.33C17.4186 27.3482 17.4513 27.3679 17.5088 27.4025L18.0104 27.7036C18.7962 28.1754 19.1888 28.4108 19.6086 28.505C19.9801 28.5884 20.3648 28.5918 20.7374 28.514C21.158 28.4261 21.5543 28.1961 22.3448 27.7373L23.0047 27.3543C23.789 26.8991 24.1823 26.6708 24.466 26.3515C24.7177 26.0682 24.9061 25.7348 25.0187 25.3729C25.145 24.9669 25.1374 24.5144 25.1223 23.6159L25.1124 23.0299C25.111 22.9442 25.1108 22.9015 25.1114 22.8593C25.1177 22.433 25.226 22.0138 25.4275 21.6381C25.4474 21.601 25.4691 21.5635 25.5118 21.4895C25.5547 21.4153 25.5769 21.3782 25.5992 21.3424C25.8241 20.9799 26.1327 20.6765 26.4991 20.4581C26.5349 20.4367 26.5718 20.4163 26.6451 20.3757L26.6476 20.3745L27.1297 20.1074C27.9317 19.6629 28.3335 19.4402 28.6252 19.1236C28.8833 18.8436 29.078 18.5119 29.1971 18.1501C29.3308 17.7436 29.3298 17.2877 29.3277 16.3814L29.326 15.6158C29.3239 14.7049 29.3228 14.2499 29.1879 13.8437C29.0687 13.4844 28.874 13.1541 28.6174 12.8758C28.3275 12.5615 27.93 12.3403 27.1356 11.8984L27.1333 11.8972Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.6671 15.9999C10.6671 18.9455 13.0549 21.3333 16.0004 21.3333C18.946 21.3333 21.3338 18.9455 21.3338 15.9999C21.3338 13.0544 18.946 10.6666 16.0004 10.6666C13.0549 10.6666 10.6671 13.0544 10.6671 15.9999Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Definições
            </button>
          </div>
        }

      </div>

    <!-- drawer -->
    <q-drawer [(visible)]="openAccountSettingsDrawer">
      <ng-template #panel>
        <app-account-settings [account]="account()"></app-account-settings>
      </ng-template>
    </q-drawer>

    <q-drawer [(visible)]="openTransferGoalDrawer">
      <ng-template #panel>
        <app-transfer-goal [account]="account()" (onSuccess)="openTransferGoalDrawer.set(false)"></app-transfer-goal>
      </ng-template>
    </q-drawer>

    <q-drawer [(visible)]="openCreateTransactionDrawer">
      <ng-template #panel>
        <app-create-transaction [defaultAccountId]="account().account.id" (onSuccess)="openCreateTransactionDrawer.set(false)"></app-create-transaction>
      </ng-template>
    </q-drawer>
      
    </app-hero>
  `,
  styles: ``
})
export class AccountHeroComponent implements OnInit {
  account = input.required<TheAccount>();
  editAccountNameFormGroup: FormGroup = new FormGroup({});
  isEditingAccount = signal<boolean>(false);

  openAccountSettingsDrawer = model<boolean>(false);
  openTransferGoalDrawer = model<boolean>(false);
  openCreateTransactionDrawer = signal<boolean>(false);

  private destroyRef = inject(DestroyRef);
  private facade = inject(AccountFacade);

  ngOnInit(): void {
    this.editAccountNameFormGroup = new FormGroup({
      'accountName': new FormControl(this.account().account.name, [ Validators.required ])
    })
  }

  openAccountSettingsDrawerFn(): void {
    this.openAccountSettingsDrawer.set(true);
  }
  
  openTransferGoalDrawerFn(): void {
    this.openTransferGoalDrawer.set(true);
  }

  submit(closeDialogFn?: () => void): void {
    if(this.editAccountNameFormGroup.invalid) return;

    this.isEditingAccount.set(true);
    const resource = new UpdateAccountDTO({
      name: this.editAccountNameFormGroup.get('accountName')?.value
    });

    this.facade.edit(this.account().account.id, resource).pipe(
      finalize(() => this.isEditingAccount.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        PopupService.success("Nome da conta atualizado com sucesso!");
        closeDialogFn?.();
      },
      error: () => {
        PopupService.error("Erro ao atualizar nome da conta. Tente novamente.");
      }
    })
  }

  isDisabled(): boolean {
    return  this.isEditingAccount() ||
            this.editAccountNameFormGroup.invalid ||
            this.editAccountNameFormGroup.pristine ||
            !this.editAccountNameFormGroup.touched ||
            this.editAccountNameFormGroup.get('accountName')?.value === this.account().account.name
  }

  onCancel(closeDialogFn: () => {}): void {
    if(this.editAccountNameFormGroup.pristine){
      closeDialogFn();
      return;
    }

    PopupService.confirm(
      "Tem alterações não guardadas. Deseja continuar mesmo assim?",
      () => {
        this.editAccountNameFormGroup.reset({ accountName: this.account().account.name });
        closeDialogFn();
      }
    );
  }
}
