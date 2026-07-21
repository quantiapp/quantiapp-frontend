import { Component, computed, ElementRef, inject, input, OnInit, output, signal, Signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountFacade } from '@client/secure/features/accounts/account.facade';
import { BaseAccount } from '@core/models/base-account.model';
import { SelectOption } from '@shared/components/forms/select.component';
import { finalize } from 'rxjs';
import { TheAccount } from '../../../details.page';
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { Darkable } from "@shared/directives/darkable";
import { ToggleComponent } from "@shared/components/forms/toggle.component";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { UpdateAccountDTO } from '@core/dtos/account.dto';

@Component({
  selector: 'app-share-account',
  imports: [BarSpinnerUi, IconContainerContainer, ReactiveFormsModule, Darkable, ToggleComponent, SubmitableButton],
  template: `
    <div class="share">
      <form [formGroup]="formGroup" (ngSubmit)="submit()" class=" flex flex-col items-end gap-1.5">
        <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-stretch">
          <div class="label text-(--secondary) text-sm flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
            <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
              <app-icon-container [width]="30" [height]="30" [key]="'share'" [colorAttr]="'fill'"></app-icon-container>
            </div>
            Habilitar partilha
          </div>
          <div class="form-control flex items-center">
            <q-toggle
            (change)="onChange($event)"
            formControlName="shareAccount"
            ></q-toggle>
          </div>
        </div>

        @if (formGroup.dirty && formGroup.get('shareAccount')?.value !== account().account.share_account) {
          <button
          type="submit"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium"
          [disabled]="formGroup.invalid || isEnablingShare()">
            @if(isEnablingShare()) {
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
export class ShareAccountComponent implements OnInit {
  account = input.required<TheAccount>();
  formGroup: FormGroup = new FormGroup({});
  isEnablingShare = signal<boolean>(false);
  shareAccountEmitter = output<boolean>();
  facade = inject(AccountFacade);
  
  accountTypes: Signal<SelectOption[]> = computed(() => this.facade.accountTypes().map(curr => ({ label: curr.description, value: curr.id })));

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'shareAccount': new FormControl(this.account().account.share_account, [ Validators.required ])
    })
  }

  onChange(state: boolean): void {
    this.shareAccountEmitter.emit(state);
  }

  submit(): void {
    if(this.formGroup.invalid) return;
    
    this.isEnablingShare.set(true);
    const share = this.formGroup.get('shareAccount')?.value;

    const dto = new UpdateAccountDTO({ share_account: share });
    this.facade.edit(this.account().account.id, dto).pipe(finalize(() => this.isEnablingShare.set(false))).subscribe({
      next: response => {},
      error: error => {}
    });
  }
}
