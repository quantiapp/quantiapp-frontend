import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { BarSpinnerUi } from '@shared/ui/spinner/bar-spinner.ui';
import { AccountFacade } from '@client/secure/features/accounts/account.facade';
import { TheAccount } from '../../../details.page';
import { finalize } from 'rxjs';
import { Darkable } from "@shared/directives/darkable";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateAccountDTO } from '@core/dtos/account.dto';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-account-color',
  imports: [IconContainerContainer, ReactiveFormsModule, SubmitableButton, BarSpinnerUi, Darkable],
  template: `
    <div class="color">
      <form [formGroup]="formGroup" (ngSubmit)="submit()" class=" flex flex-col items-end gap-1.5">
        <label for="account_color" class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-stretch">
          <div class="label text-(--secondary) flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
            <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
              <app-icon-container [width]="30" [height]="30" [key]="'color-palette'"></app-icon-container>
            </div>
            Cor predifinida
          </div>
          <div class="form-control">
            <input type="color" id="account_color" formControlName="accountColor" class="h-full w-13 rounded-full">
          </div>
        </label>

        @if (formGroup.dirty && formGroup.get('accountColor')?.value !== account().account.color) {
          <button
          type="submit"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium"
          [disabled]="formGroup.invalid || isUpdatingAccountColor()">
            @if(isUpdatingAccountColor()) {
              <app-bar-spinner></app-bar-spinner>
            } @else {
              Salvar alterações
            }
          </button>
        }
      </form>
    </div>
  `,
  styles: `
    #account_color::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    #account_color::-webkit-color-swatch {
      border: none;
      border-radius: 50%;
    }
  `
})
export class AccountColorComponent implements OnInit {
  account = input.required<TheAccount>();
  formGroup: FormGroup = new FormGroup({});
  isUpdatingAccountColor = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  facade = inject(AccountFacade);

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'accountColor': new FormControl(this.account().account.color, [ Validators.required ])
    });
  }

  submit(): void {
    if(this.formGroup.invalid) return;
    
    this.isUpdatingAccountColor.set(true);
    const color = this.formGroup.get('accountColor')?.value;

    const dto = new UpdateAccountDTO({ color });
    this.facade.edit(this.account().account.id, dto).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isUpdatingAccountColor.set(false))).subscribe({
      next: () => {
        PopupService.success("Cor da conta atualizada com sucesso!");
        this.formGroup.markAsPristine();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.error?.error || "Erro ao atualizar cor da conta.";
        PopupService.error(errorMsg);
      }
    });
  }
}

