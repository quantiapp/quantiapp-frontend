import { Component, computed, DestroyRef, inject, OnInit, output, signal, Signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectComponent, SelectOption } from "@shared/components/forms/select.component";
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { Darkable } from "@shared/directives/darkable";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { AccountFacade } from '../../account.facade';
import { BaseAccount } from '@core/models/base-account.model';
import { finalize } from 'rxjs';
import { SpinnerUi } from "@shared/ui/spinner/spinner.ui";
import { accountProviders } from '../../provider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateAccountDTO } from '@core/dtos/account.dto';
import { PopupService } from '@core/services/pop-up.service';

import { PlanService } from '@core/services/plan.service';

@Component({
  selector: 'app-create-account',
  imports: [SelectComponent, IconContainerContainer, Darkable, ReactiveFormsModule, SubmitableButton, SpinnerUi],
  providers: [...accountProviders()],
  template: `
    <div class="panel-body flex gap-5 flex-col">
      <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Registrar conta</h1>

      @if(!canCreateAccount()) {
        <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-600 dark:text-amber-400 text-xs font-medium text-center">
          ⚠️ Atingiu o limite de contas do seu plano atual. Faça upgrade para registrar mais contas.
        </div>
      }

      <form (submit)="submit()" [formGroup]="createAccountFormGroup" class="panel-form flex gap-5 flex-col">
        <div class="form-control flex flex-col gap-2.5">
          <label for="#account_name" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Nome da Conta</label>
          <input type="text"
          id="account_name"
          class="bg-[#FAFAFA] text-sm border border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
          formControlName="accountName" placeholder="Banco Quantum" >
        </div>

        <div class="form-control flex flex-col gap-2.5">
          <label for="#account_type" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Tipo de conta</label>
          <q-select
          [appearence]="['w-full']"
          [dropdownAppearence]="['!w-full']"
          id="account_type"
          [options]="accountTypes()"
          formControlName="accountType"
          >
            <ng-template #option let-option>
              <div style="display: flex; align-items: center; gap: 8px">
                <app-icon-container [key]="option.icon"></app-icon-container>
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </q-select>
        </div>

        <div class="form-control flex flex-col gap-2.5">
          <label for="#account_currency" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Moeda da conta</label>
          <q-select
          [appearence]="['w-full']"
          [dropdownAppearence]="['!w-full']"
          id="account_currency"
          [options]="currencies()"
          formControlName="accountCurrency"
          >
            <ng-template #option let-option>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </q-select>
        </div>
        <div class="form-control flex flex-col gap-2.5">
          <label for="#account_color" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Cor de destaque</label>
          <input type="color"
          id="account_color"
          class="bg-[#FAFAFA] text-sm border h-10 border-black/5 w-full text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
          formControlName="accountColor" >
        </div>

        <div class="submit">
          <button
          type="submit"
          [disabled]="this.isCreatingAccount() || this.createAccountFormGroup.invalid || !canCreateAccount()"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium disabled:opacity-50">
            @if(isCreatingAccount()){
              <app-spinner />
            } @else {
              Concluir o registro
            }
          </button>
        </div>

      </form>
    </div>
  `,
  styles: `
    #account_color::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    #account_color::-webkit-color-swatch {
      border: none;
      border-radius: 5px;
      width: 100%;
    }
    :host {
      display: block;
    }
  `
})
export class CreateAccountComponent implements OnInit {
  onSuccess = output<void>();

  createAccountFormGroup: FormGroup = new FormGroup({});
  isCreatingAccount = signal<boolean>(false);

  private destroyRef = inject(DestroyRef);
  private accountFacade = inject(AccountFacade);
  private planService = inject(PlanService);

  canCreateAccount = this.planService.canCreateAccount;
  accountTypes: Signal<SelectOption[]> = computed(() => this.accountFacade.accountTypes().map(act => ({ label: act.description, value: act.id, icon: act.icon_key })));
  currencies: Signal<SelectOption[]> = computed(() => this.accountFacade.currencies().map(curr => ({ label: curr.code, value: curr.id })));

  ngOnInit(): void {
    this.createAccountFormGroup = new FormGroup({
      'accountName': new FormControl(null, [ Validators.required ]),
      'accountType': new FormControl(null, [ Validators.required ]),
      'accountCurrency': new FormControl(null, [ Validators.required ]),
      'accountColor': new FormControl('#F1C40F', [ Validators.required ])
    })
  }

  submit(): void {
    if(!this.canCreateAccount()) {
      PopupService.error("Atingiu o limite de contas do seu plano atual. Faça upgrade para registrar mais.");
      return;
    }
    if(this.createAccountFormGroup.invalid) return;

    this.isCreatingAccount.set(true);
    
    const accountDto = new CreateAccountDTO(
      this.createAccountFormGroup.get('accountName')!.value,
      this.createAccountFormGroup.get('accountType')!.value,
      0,
      this.createAccountFormGroup.get('accountColor')!.value,
      this.createAccountFormGroup.get('accountCurrency')!.value,
      false
    );

    this.accountFacade.create(accountDto).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isCreatingAccount.set(false))
    ).subscribe({
      next: () => {
        PopupService.success("Conta criada com sucesso!");
        this.createAccountFormGroup.reset({ accountColor: '#F1C40F' });
        this.onSuccess.emit();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.error?.error || "Erro ao criar conta. Tente novamente.";
        PopupService.error(errorMsg);
      }
    });
  }
}
