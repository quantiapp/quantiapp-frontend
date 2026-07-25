import { Component, computed, HostListener, inject, input, OnInit, signal, Signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountFacade } from '@client/secure/features/accounts/account.facade';
import { BaseAccount } from '@core/models/base-account.model';
import { SelectOption, SelectComponent } from '@shared/components/forms/select.component';
import { finalize } from 'rxjs';
import { TheAccount } from '../../../details.page';
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { WordReplacerPipe } from '@shared/pipes/word-replacer-pipe';
import { SubmitableButton } from "@shared/directives/submitable-button";
import { MotionedHeight } from "@shared/directives/motioned-height";
import { Darkable } from "@shared/directives/darkable";
import { ClickHandler } from '@core/services/click-handler.service';
import { UpdateAccountDTO } from '@core/dtos/account.dto';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-account-type',
  imports: [BarSpinnerUi, SelectComponent, IconContainerContainer, ReactiveFormsModule, WordReplacerPipe, SubmitableButton, Darkable],
  template: `
    <div class="account-type">
      <form [formGroup]="formGroup" (ngSubmit)="submit()" class=" flex flex-col items-end gap-1.5">
        <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-stretch">
          <div class="label text-(--secondary) text-sm flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
            <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
              <app-icon-container [width]="30" [height]="30" [key]="'card'"></app-icon-container>
            </div>
            Tipo de conta
          </div>
          <div class="form-control flex items-center">
            <q-select
            [triggerAppearence]="['px-2!', 'py-1!', 'bg-white!', 'rounded-[9px]!', 'border-black/12!']"
            id="account_type"
            [options]="accountTypes()"
            formControlName="accountType"
            >
              <ng-template #trigger let-option>
                <span class="capitalize">{{ option.label | wordReplacer: 'Conta ': ''}}</span>
              </ng-template> 

              <ng-template #option let-option>
                <div style="display: flex; align-items: center; gap: 8px">
                  <span class=" capitalize">{{ option.label | wordReplacer: 'Conta ': ''}}</span>
                </div>
              </ng-template>
            </q-select>
          </div>
        </div>

        @if (formGroup.dirty && formGroup.get('accountType')?.value !== account().account.account_type.id) {
          <button
          type="submit"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium"
          [disabled]="formGroup.invalid || isUpdatingAccountType()">
            @if(isUpdatingAccountType()) {
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
export class AccountTypeComponent implements OnInit {
  account = input.required<TheAccount>();
  formGroup: FormGroup = new FormGroup({});
  isUpdatingAccountType = signal<boolean>(false);
  facade = inject(AccountFacade);
  
  accountTypes: Signal<SelectOption[]> = computed(() => this.facade.accountTypes().map(type => ({ label: type.description, value: type.id })));

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'accountType': new FormControl(this.account().account.account_type.id, [ Validators.required ])
    })
  }

  submit(): void {
    if(this.formGroup.invalid) return;
    
    this.isUpdatingAccountType.set(true);
    const type = this.formGroup.get('accountType')?.value;

    const dto = new UpdateAccountDTO({ account_type_id: type });
    this.facade.edit(this.account().account.id, dto).pipe(finalize(() => this.isUpdatingAccountType.set(false))).subscribe({
      next: () => {
        PopupService.success("Tipo de conta atualizado com sucesso!");
        this.formGroup.markAsPristine();
      },
      error: () => {
        PopupService.error("Erro ao atualizar tipo de conta.");
      }
    });
  }
}

