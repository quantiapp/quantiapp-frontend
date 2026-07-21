import { Component, computed, DestroyRef, inject, input, OnInit, Signal, signal } from '@angular/core';
import { TheAccount } from '../../details.page';
import { SpinnerUi } from "@shared/ui/spinner/spinner.ui";
import { Darkable } from "@shared/directives/darkable";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransferGoalResource } from '@core/models/base-account.model';
import { finalize } from 'rxjs';
import { AccountFacade } from '../../../account.facade';
import { SelectComponent, SelectGroup, SelectOption } from "@shared/components/forms/select.component";
import { FinanceStore } from '@core/data/finance-store.data';

@Component({
  selector: 'app-transfer-goal',
  imports: [SpinnerUi, ReactiveFormsModule, Darkable, SubmitableButton, SelectComponent],
  template: `
  
    @if(account()!.type !== 'shared'){
    <div class="panel-body flex gap-5 flex-col">
      <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Transferência de meta</h1>

      <form (submit)="submit()" [formGroup]="transferGoalFormGroup" class="panel-form flex gap-5 flex-col">
        <div class="form-control flex flex-col gap-2.5">
          <label for="#source_account" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Conta origem</label>
          <input type="text"
          id="source_account"
          class="bg-[#FAFAFA] text-sm border border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
          formControlName="source_account" readonly placeholder="" >
        </div>

        <div class="form-control flex flex-col gap-2.5">
          <label for="#goals" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Meta</label>
          <q-select
          [appearence]="['w-full']"
          [dropdownAppearence]="['!w-full']"
          id="goals"
          [options]="goalsSelectOptions()"
          formControlName="goal"
          >
            <ng-template #option let-option>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </q-select>
        </div>

        <div class="form-control flex flex-col gap-2.5">
          <label for="#goals" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Conta destino</label>
          <q-select
          [appearence]="['w-full']"
          [dropdownAppearence]="['!w-full']"
          id="goals"
          [groups]="accountsGroupSelect()"
          formControlName="destination_account"
          >
            <ng-template #option let-option>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </q-select>
        </div>

        <div class="submit">
          <button
          type="submit"
          [disabled]="this.isTransferingGoal() || this.transferGoalFormGroup.invalid"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium">
            @if(isTransferingGoal()){
              <app-spinner />
            } @else {
              Concluir transição
            }
          </button>
        </div>

      </form>
    </div>
    }
  `,
  styles: ``
})
export class TransferGoalComponent implements OnInit {
  account = input.required<TheAccount>();

  isTransferingGoal = signal<boolean>(false);
  transferGoalFormGroup = new FormGroup<any>({});
  facade = inject(AccountFacade);
  financeStore = inject(FinanceStore);

  private destroyRef = inject(DestroyRef);

  private goals = computed(() => this.financeStore.goalsByAccountIdMap()[this.account().account.id]);
  goalsSelectOptions: Signal<SelectOption[]> = computed(() => this.goals().map(g => ({ label: g.name, value: g.id })));
  accountsGroupSelect: Signal<SelectGroup[]> = computed(() => {
    const accountsExceptCurrent = this.financeStore.accounts().filter(a => a.id !== this.account().account.id);
    
    const myAccounts: SelectGroup = {
      label: 'Suas contas',
      options: [...accountsExceptCurrent.map(a => ({ label: a.name, value: a.id }))]
    }

    const sharedAccount: SelectGroup = {
      label: 'Partilhas consigo',
      options: [ ...this.financeStore.shared_accounts().map(a => ({ label: a.name, value: a.id })) ]
    }

    return [ myAccounts, sharedAccount ]
  })

  ngOnInit(): void {
    this.transferGoalFormGroup = new FormGroup({
      'source_account': new FormControl(this.account().account.name, [ Validators.required ]),
      'goal': new FormControl(null, [ Validators.required ]),
      'destination_account': new FormControl(null, [ Validators.required ])
    })
  }

  submit(): void {
    if(this.transferGoalFormGroup.invalid) return;
    this.isTransferingGoal.set(true);

    const resource: TransferGoalResource = {
      ...this.transferGoalFormGroup.value,
      source_account: this.account().account.id
    };

    this.facade.transferGoal(resource).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isTransferingGoal.set(false);
      })
    ).subscribe({
      next: response => {
        console.log(response)
      },
      error: error => {
        console.error(error)
      }
    })
  }
}
