import { Component, computed, DestroyRef, inject, input, OnInit, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseGoal } from '@core/models/base-goal.model';
import { PopupService } from '@core/services/pop-up.service';
import { Darkable } from "@shared/directives/darkable";
import { finalize } from 'rxjs';
import { GoalFacade } from '../../goal.facade';
import { TheGoal } from '../../goal-details/goal-details.page';
import { TheAccount } from '@client/secure/features/accounts/account-details/details.page';
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { SelectComponent, SelectGroup, SelectOption } from "@shared/components/forms/select.component";
import { ControlCharCounterUi } from "@shared/ui/input-char-counter/input-char-counter.ui";
import { UpdateGoalDTO } from '@core/dtos/goal.dto';
import { icon_keys } from '@core/const/icons';
import { MoneyInputComponent } from "@shared/components/forms/money-input.component";
import { CheckboxComponent } from "@shared/components/forms/checkbox.component";

@Component({
  selector: 'app-edit-goal',
  imports: [ReactiveFormsModule, Darkable, BarSpinnerUi, SubmitableButton, IconContainerContainer, SelectComponent, ControlCharCounterUi, MoneyInputComponent, CheckboxComponent],
  template: `
    <form [formGroup]="editGoalFormGroup" class="edit-account-name flex flex-col gap-2">
      <div class="panel-body flex flex-col gap-6">
      
        <div class="form-control flex flex-col gap-2.5">
          <label for="#account" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Conta</label>
          <q-select
          [appearence]="['w-full']"
          id="account"
          formControlName="account"
          [groups]="accountsGroupSelect()"
          >
            <ng-template #option let-option>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </q-select>
        </div>

        <div class="form-control">
          <q-control-char-counter [id]="'name'" [control]="editGoalFormGroup.get('name')!" [limit]="30" [label]="'Meta'">
            <ng-template #templateInput>
              <input
              type="text"
              id="name"
              class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
              formControlName="name" maxlength="{{30}}" [minlength]="5" placeholder="Contrução da casa dos sonhos" >
            </ng-template>
          </q-control-char-counter>
        </div>

        <div class="form-control">
          <q-control-char-counter [id]="'description'" [control]="editGoalFormGroup.get('description')!" [limit]="50" [label]="'Descrição'">
            <ng-template #templateInput>
              <input
              type="text"
              id="description"
              class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
              formControlName="description" maxlength="{{50}}" [minlength]="5" placeholder="Poupança para a construção" >
            </ng-template>
          </q-control-char-counter>
        </div>

        <div class="form-control flex flex-col gap-2.5">
          <label for="#icon" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Ícone</label>
          <q-select
          [appearence]="['w-full']"
          [dropdownAppearence]="['!w-full']"
          id="icon"
          formControlName="iconKey"
          [displayKey]="'icon'"
          [options]="icons()"
          >
            <ng-template #option let-option>
              <div style="display: flex; align-items: center; gap: 8px">
                <app-icon-container [key]="option.icon"></app-icon-container>
              </div>
            </ng-template>
          </q-select>
        </div>

        <div class="form-control flex flex-col gap-2.5">
          <label for="#currentAmount" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Quantia corrente</label>
          <q-money-input
          [id]="'currentAmount'"
          formControlName="currentAmount"
          [enterKeyHint]="'next'"
          />
        </div>

        <div class="form-control flex justify-between items-center">
          <label for="#track_progress" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">
            Acompanhar o progresso
          </label>
          <q-checkbox
          [id]="'track_progress'"
          formControlName="trackProgress"
          />
        </div>

        @if(this.editGoalFormGroup.get('trackProgress')?.value) {
          <div class="form-control flex flex-col gap-2.5">
            <label for="#targetAmount" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Quantia a atingir</label>
            <q-money-input
            [id]="'targetAmount'"
            formControlName="targetAmount"
            [enterKeyHint]="'done'"
            />
          </div>
        }
      </div>
      <div class="dialog-footer flex gap-3 justify-end items-center bg-white z-5 py-4 sticky bottom-0" appDarkable="dark:bg-(color:--secondary)">
        <button (click)="onCancel(closeDialogFn())"
        class="w-fit text-sm text-(--secondary)/60 border border-(--secondary)/60 dark:border-(--dm-secondary)/60 rounded-[0.563rem] px-2 py-1 font-medium"
        appDarkable="dark:text-(--dm-secondary)/60"
        >
          Cancelar
        </button>
        <button
        [disabled]="isDisabled()"
        (click)="submit()"
        appSubmitableButton
        tailwindClassBackgroundColor="bg-(color:--primary)/63"
        tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
        class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium">
          @if(isEditingGoal()){
            <app-bar-spinner></app-bar-spinner>
          } @else {
            Submeter
          } 
        </button>
      </div>
    </form>
  `,
  styles: ``
})
export class EditGoalComponent implements OnInit {

  goal = input.required<TheGoal>();
  account = input.required<TheAccount>();
  closeDialogFn = input.required<() => {}>();

  editGoalFormGroup: FormGroup = new FormGroup({});
  isEditingGoal = signal<boolean>(false);

  destroyRef = inject(DestroyRef);
  
  accountsGroupSelect: Signal<SelectGroup[]> = computed(() => {
    const shared_accounts = this.facade.shared_accounts().filter(a => a); // some filter if needed. Ex: accounts which user can manage goals
    
    const myAccounts: SelectGroup = {
      label: 'Suas contas',
      options: [...this.facade.accounts().map(a => ({ label: a.name, value: a.id }))]
    }

    const sharedAccount: SelectGroup = {
      label: 'Partilhas consigo',
      options: [ ...shared_accounts.map(a => ({ label: a.name, value: a.id })) ]
    }

    return [ myAccounts, sharedAccount ]
  })
  icons = signal<SelectOption[]>(icon_keys.map(key => ({ icon: key, label: key, value: key })));
  
  facade = inject(GoalFacade);

  ngOnInit(): void {
    this.editGoalFormGroup = new FormGroup({
      'account': new FormControl(this.account().account.id, [ Validators.required ]),
      'name': new FormControl(this.goal().goal.name, [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
      'description': new FormControl(this.goal().goal.description, [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ]),
      'currentAmount': new FormControl(this.goal().goal.current_amount, [ Validators.required ]),
      'trackProgress': new FormControl(this.goal().goal.track_progress, [ Validators.required ]),
      'iconKey': new FormControl(this.goal().goal.icon_key, [ Validators.required ])
    })

    if(this.goal().goal.track_progress) {
      this.editGoalFormGroup.addControl('targetAmount', new FormControl(this.goal().goal.target_amount, [ Validators.required ]), { emitEvent: true });
    }

    this.editGoalFormGroup.get('trackProgress')?.valueChanges.subscribe(value => {
      if(value) {
        this.editGoalFormGroup.addControl('targetAmount', new FormControl(this.goal().goal.target_amount, [ Validators.required ]), { emitEvent: true });
      } else {
        this.editGoalFormGroup.removeControl('targetAmount', { emitEvent: true })
      }
    })

    this.editGoalFormGroup.valueChanges.subscribe(values => console.log(values))
  }

  submit(): void {
    if(this.editGoalFormGroup.invalid) return;

    this.isEditingGoal.set(true);
    
    const goalDto = new UpdateGoalDTO({
      name: this.editGoalFormGroup.get('name')?.value,
      description: this.editGoalFormGroup.get('description')?.value,
      current_amount: this.editGoalFormGroup.get('currentAmount')?.value,
      target_amount: this.editGoalFormGroup.get('targetAmount')?.value,
      track_progress: this.editGoalFormGroup.get('trackProgress')?.value,
      icon_key: this.editGoalFormGroup.get('iconKey')?.value,
      account_id: this.editGoalFormGroup.get('account')?.value
    });

    this.facade.edit(this.goal().goal.id, goalDto).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isEditingGoal.set(false))
    ).subscribe({
      next: (goal) => {
        PopupService.success("Meta atualizada com sucesso!");
        this.closeDialogFn()();
      },
      error: () => {
        PopupService.error("Erro ao atualizar meta. Tente novamente.");
      }
    });
  }

  isDisabled(): boolean {
    return  this.isEditingGoal() ||
            this.editGoalFormGroup.invalid ||
            this.editGoalFormGroup.pristine ||
            !this.editGoalFormGroup.touched ||
            this.unchangedControls()
  }

  unchangedControls(): boolean {
    return  this.editGoalFormGroup.get('name')?.value === this.goal().goal.name &&
            this.editGoalFormGroup.get('description')?.value === this.goal().goal.description &&
            this.editGoalFormGroup.get('currentAmount')?.value === this.goal().goal.current_amount &&
            this.editGoalFormGroup.get('trackProgress')?.value === this.goal().goal.track_progress &&
            (this.editGoalFormGroup.get('trackProgress')?.value ?
              this.editGoalFormGroup.get('targetAmount')?.value === this.goal().goal.target_amount :
              true
            ) &&
            this.editGoalFormGroup.get('iconKey')?.value === this.goal().goal.icon_key &&
            this.editGoalFormGroup.get('account')?.value === this.account().account.id
  }

  onCancel(closeDialogFn: () => {}): void {
    if(this.editGoalFormGroup.pristine || this.unchangedControls()){
      closeDialogFn();
      return;
    }

    PopupService.confirm(
      "Tem alterações não guardadas. Deseja continuar mesmo assim?",
      () => {
        this.editGoalFormGroup.reset({
          name: this.goal().goal.name,
          description: this.goal().goal.description,
          currentAmount: this.goal().goal.current_amount,
          targetAmount: this.goal().goal.target_amount,
          trackProgress: this.goal().goal.track_progress,
          iconKey: this.goal().goal.icon_key,
          account: this.account().account.id
        });
        closeDialogFn();
      }
    );
  }
}
