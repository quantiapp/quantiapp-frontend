import { Component, computed, DestroyRef, inject, input, OnInit, Signal, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountFacade } from '@client/secure/features/accounts/account.facade';
import { finalize } from 'rxjs';
import { TheAccount } from '../../../details.page';
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { Darkable } from "@shared/directives/darkable";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { SelectComponent, SelectOption } from "@shared/components/forms/select.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateAccountDTO } from '@core/dtos/account.dto';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-account-currency',
  imports: [BarSpinnerUi, IconContainerContainer, ReactiveFormsModule, Darkable, SubmitableButton, SelectComponent],
  template: `
    <div class="currency">
      <form [formGroup]="formGroup" (ngSubmit)="submit()" class=" flex flex-col items-end gap-1.5">
        <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-stretch">
          <div class="label text-(--secondary) flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
            <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
              <app-icon-container [width]="30" [height]="30" [key]="'dolar'" [colorAttr]="'fill'"></app-icon-container>
            </div>
            Moeda
          </div>
          <div class="form-control flex items-center">
            <q-select
            [triggerAppearence]="['px-2!', 'py-1!', 'bg-white!', 'rounded-[9px]!', 'border-black/12!']"
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
        </div>

        @if (formGroup.dirty && formGroup.get('accountCurrency')?.value !== account().account.currency.id) {
          <button
          type="submit"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(currency:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-fit currency-butn text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium"
          [disabled]="formGroup.invalid || isUpdatingAccountCurrency()">
            @if(isUpdatingAccountCurrency()) {
              <app-bar-spinner></app-bar-spinner>
            } @else {
              Salvar alterações
            }
          </button>
        }
      </form>
    </div>
  `,
  styles: ``
})
export class AccountCurrencyComponent implements OnInit {
  account = input.required<TheAccount>();
  formGroup: FormGroup = new FormGroup({});
  isUpdatingAccountCurrency = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  facade = inject(AccountFacade);
  
  currencies: Signal<SelectOption[]> = computed(() => this.facade.currencies().map(curr => ({ label: curr.code, value: curr.id })));

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'accountCurrency': new FormControl(this.account().account.currency.id, [ Validators.required ])
    });
  }

  submit(): void {
    if(this.formGroup.invalid) return;
    
    this.isUpdatingAccountCurrency.set(true);
    const currency = this.formGroup.get('accountCurrency')?.value;

    const dto = new UpdateAccountDTO({ currency_id: currency });
    this.facade.edit(this.account().account.id, dto).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isUpdatingAccountCurrency.set(false))).subscribe({
      next: () => {
        PopupService.success("Moeda da conta atualizada com sucesso!");
        this.formGroup.markAsPristine();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.error?.error || "Erro ao atualizar moeda da conta.";
        PopupService.error(errorMsg);
      }
    });
  }
}

