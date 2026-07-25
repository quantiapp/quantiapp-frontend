import { Component, computed, DestroyRef, inject, input, OnInit, output, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectOption, SelectComponent, SelectGroup } from '@shared/components/forms/select.component';
import { finalize } from 'rxjs';
import { SpinnerUi } from "@shared/ui/spinner/spinner.ui";
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { Darkable } from "@shared/directives/darkable";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { GoalFacade } from '../../goal.facade';
import { CreateGoalDTO } from '@core/dtos/goal.dto';
import { icon_keys } from '@core/const/icons';
import { goalProviders } from '../../provider';
import { ControlCharCounterUi } from "@shared/ui/input-char-counter/input-char-counter.ui";
import { CheckboxComponent } from "@shared/components/forms/checkbox.component";
import { MoneyInputComponent } from "@shared/components/forms/money-input.component";
import { PopupService } from '@core/services/pop-up.service';
import { PlanService } from '@core/services/plan.service';

@Component({
  selector: 'app-create-goal',
  providers: [...goalProviders()],
  imports: [SpinnerUi, SelectComponent, IconContainerContainer, ReactiveFormsModule, Darkable, SubmitableButton, ControlCharCounterUi, CheckboxComponent, MoneyInputComponent],
  template: `
    <div class="panel-body flex gap-5 flex-col">
      <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Registrar meta</h1>

      @if(selectedAccount() && !canCreateGoalForSelectedAccount()) {
        <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-600 dark:text-amber-400 text-xs font-medium text-center">
          ⚠️ Atingiu o limite de metas para esta conta no seu plano atual. Faça upgrade para registrar mais metas.
        </div>
      }

      <form (submit)="submit()" [formGroup]="createGoalFormGroup" class="panel-form flex gap-5 flex-col">

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
          <q-control-char-counter [id]="'name'" [control]="createGoalFormGroup.get('name')!" [limit]="30" [label]="'Meta'">
            <ng-template #templateInput let-onChangeFn="count">
              <input
              type="text"
              id="name"
              class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
              formControlName="name" maxlength="{{30}}" [minlength]="5" placeholder="Contrução da casa dos sonhos" >
            </ng-template>
          </q-control-char-counter>
        </div>

        <div class="form-control">
          <q-control-char-counter [id]="'description'" [control]="createGoalFormGroup.get('description')!" [limit]="50" [label]="'Descrição'">
            <ng-template #templateInput let-onChangeFn="count">
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
          [dropdownAppearence]="['w-full!']"
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

        @if(this.createGoalFormGroup.get('trackProgress')?.value) {
          <div class="form-control flex flex-col gap-2.5">
            <label for="#targetAmount" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Quantia a atingir</label>
            <q-money-input
            [id]="'targetAmount'"
            formControlName="targetAmount"
            [enterKeyHint]="'done'"
            />
          </div>
        }

        <div class="submit">
          <button
          type="submit"
          [disabled]="this.isCreatingGoal() || this.createGoalFormGroup.invalid || !canCreateGoalForSelectedAccount()"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium disabled:opacity-50">
            @if(isCreatingGoal()){
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
    :host {
      display: block;
    }
  `
})
export class CreateGoalComponent implements OnInit {
  defaultAccountId = input<string | undefined>();
  onSuccess = output<void>();

  createGoalFormGroup: FormGroup = new FormGroup({});
  isCreatingGoal = signal<boolean>(false);
  selectedAccount = signal<string | undefined>(undefined);

  destroyRef = inject(DestroyRef);

  private goalFacade = inject(GoalFacade);
  private planService = inject(PlanService);

  canCreateGoalForSelectedAccount = computed(() => {
    const accId = this.selectedAccount();
    return this.planService.canCreateGoal()(accId);
  });

  accountsGroupSelect: Signal<SelectGroup[]> = computed(() => {
    const shared_accounts = this.goalFacade.shared_accounts().filter(a => a);
    
    const myAccounts: SelectGroup = {
      label: 'Suas contas',
      options: [...this.goalFacade.accounts().map(a => ({ label: a.name, value: a.id }))]
    }

    const sharedAccount: SelectGroup = {
      label: 'Partilhas consigo',
      options: [ ...shared_accounts.map(a => ({ label: a.name, value: a.id })) ]
    }

    return [ myAccounts, sharedAccount ]
  })
  icons = signal<SelectOption[]>(icon_keys.map(key => ({ icon: key, label: key, value: key })));

  ngOnInit(): void {
    const initialAccount = this.defaultAccountId() || null;
    this.selectedAccount.set(this.defaultAccountId());

    this.createGoalFormGroup = new FormGroup({
      'account': new FormControl(initialAccount, [ Validators.required ]),
      'name': new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
      'description': new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ]),
      'currentAmount': new FormControl(null, [ Validators.required ]),
      'trackProgress': new FormControl(true, [ Validators.required ]),
      'iconKey': new FormControl(null, [ Validators.required ])
    });

    this.createGoalFormGroup.get('account')?.valueChanges.subscribe(val => {
      this.selectedAccount.set(val);
    });

    if(this.createGoalFormGroup.get('trackProgress')?.value) {
      this.createGoalFormGroup.addControl('targetAmount', new FormControl(null, [ Validators.required ]), { emitEvent: true });
    }

    this.createGoalFormGroup.get('trackProgress')?.valueChanges.subscribe(value => {
      if(value) {
        this.createGoalFormGroup.addControl('targetAmount', new FormControl(null, [ Validators.required ]), { emitEvent: true });
      } else {
        this.createGoalFormGroup.removeControl('targetAmount', { emitEvent: true })
      }
    })
  }

  submit(): void {
    const accId = this.createGoalFormGroup.get('account')?.value;
    if(!this.planService.canCreateGoal()(accId)) {
      PopupService.error("Atingiu o limite de metas para esta conta no seu plano atual.");
      return;
    }

    if(this.createGoalFormGroup.invalid) return;

    this.isCreatingGoal.set(true);
    
    const goalDto = new CreateGoalDTO(
      this.createGoalFormGroup.get('name')?.value,
      this.createGoalFormGroup.get('description')?.value,
      Number(this.createGoalFormGroup.get('currentAmount')?.value ?? 0),
      Number(this.createGoalFormGroup.get('targetAmount')?.value ?? 0),
      Boolean(this.createGoalFormGroup.get('trackProgress')?.value),
      this.createGoalFormGroup.get('iconKey')?.value,
      accId
    );

    this.goalFacade.create(goalDto).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isCreatingGoal.set(false))
    ).subscribe({
      next: () => {
        PopupService.success("Meta criada com sucesso!");
        this.onSuccess.emit();
      },
      error: () => {
        PopupService.error("Erro ao criar meta. Tente novamente.");
      }
    });
  }

}
