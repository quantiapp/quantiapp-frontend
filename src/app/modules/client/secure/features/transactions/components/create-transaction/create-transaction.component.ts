import { Component, computed, DestroyRef, inject, input, linkedSignal, OnInit, output, Signal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionFacade } from '../../transaction.facade';
import { SelectGroup, SelectComponent, SelectOption } from '@shared/components/forms/select.component';
import { CreateTransactionDTO } from '@core/dtos/transaction.dto';
import { SpinnerUi } from "@shared/ui/spinner/spinner.ui";
import { ControlCharCounterUi } from "@shared/ui/input-char-counter/input-char-counter.ui";
import { MoneyInputComponent } from "@shared/components/forms/money-input.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AccountService } from '@client/secure/features/accounts/account.service';
import { Darkable } from "@shared/directives/darkable";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { FinanceStore } from '@core/data/finance-store.data';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-create-transaction',
  providers: [TransactionFacade, AccountService],
  imports: [SpinnerUi, SelectComponent, ControlCharCounterUi, MoneyInputComponent, ReactiveFormsModule, Darkable, SubmitableButton],
  template: `
    <div class="panel-body flex gap-5 flex-col">
      <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Registrar transação</h1>

      <form (submit)="submit()" [formGroup]="createTransactionFormGroup" class="panel-form flex gap-5 flex-col">
      
        <!-- TÍTULO -->
        <div class="form-control">
          <q-control-char-counter [id]="'notes'" [control]="createTransactionFormGroup.get('notes')!" [limit]="30" [label]="'Título'">
            <ng-template #templateInput let-onChangeFn="count">
              <input
              type="text"
              id="notes"
              class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
              formControlName="notes" maxlength="30" minlength="5" placeholder="Devolução do dinheiro para ..." >
            </ng-template>
          </q-control-char-counter>
        </div>

        <!-- DESCRIÇÃO -->
        <div class="form-control">
          <q-control-char-counter [id]="'description'" [control]="createTransactionFormGroup.get('description')!" [limit]="50" [label]="'Descrição'">
            <ng-template #templateInput let-onChangeFn="count">
              <input
              type="text"
              id="description"
              class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
              formControlName="description" maxlength="50" minlength="5" placeholder="Poupança para a construção" >
            </ng-template>
          </q-control-char-counter>
        </div>

        <!-- QUANTIA -->
        <div class="form-control flex flex-col gap-2.5">
          <label for="#amount" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Quantia corrente</label>
          <q-money-input
          [id]="'amount'"
          formControlName="amount"
          [enterKeyHint]="'next'"
          />
        </div>

        <!-- DATA -->
        <div class="form-control flex flex-col gap-2.5">
          <label for="#date" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Data</label>
          <input
          type="date"
          id="date"
          class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
          formControlName="date"
          >
        </div>

        <!-- TIPO DE TRANSAÇÃO -->
        <div class="form-control flex flex-col gap-2.5">
          <label for="#type" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Tipo de transação</label>
          <q-select
          [appearence]="['w-full']"
          [dropdownAppearence]="['!w-full']"
          id="type"
          formControlName="type"
          [options]="accountTypes()"
          >
            <ng-template #option let-option>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </q-select>
        </div>

        <!-- ORIGEM (CONTA & META) -->
        @if (createTransactionFormGroup.get('type')?.value === 'expense' || createTransactionFormGroup.get('type')?.value === 'g2g') {
          <div class="form-control flex flex-col gap-2.5">
            <label for="#sourceAccount" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Conta Origem</label>
            <q-select
            [appearence]="['w-full']"
            [dropdownAppearence]="['!w-full']"
            id="sourceAccount"
            formControlName="sourceAccount"
            [groups]="accountsGroupSelect()"
            >
              <ng-template #option let-option>
                <div style="display: flex; align-items: center; gap: 8px">
                  <span>{{ option.label }}</span>
                </div>
              </ng-template>
            </q-select>
          </div>

          @if (sourceAccountGoalsSelectOptions().length > 0 && sourceAccountGoalsSelectOptions()[0].options.length > 0) {
            <div class="form-control flex flex-col gap-2.5">
              <label for="#sourceGoal" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">
                Meta Origem
              </label>
              <q-select
              [appearence]="['w-full']"
              [dropdownAppearence]="['!w-full']"
              id="sourceGoal"
              formControlName="sourceGoal"
              [groups]="sourceAccountGoalsSelectOptions()"
              >
                <ng-template #option let-option>
                  <div style="display: flex; align-items: center; gap: 8px">
                    <span>{{ option.label }}</span>
                  </div>
                </ng-template>
              </q-select>
            </div>
          }
        }

        <!-- DESTINO (CONTA & META) -->
        @if (createTransactionFormGroup.get('type')?.value === 'income' || createTransactionFormGroup.get('type')?.value === 'g2g') {
          <div class="form-control flex flex-col gap-2.5">
            <label for="#destinationAccount" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">Conta Destino</label>
            <q-select
            [appearence]="['w-full']"
            [dropdownAppearence]="['!w-full']"
            id="destinationAccount"
            formControlName="destinationAccount"
            [groups]="accountsGroupSelect()"
            >
              <ng-template #option let-option>
                <div style="display: flex; align-items: center; gap: 8px">
                  <span>{{ option.label }}</span>
                </div>
              </ng-template>
            </q-select>
          </div>

          @if (destAccountGoalsSelectOptions().length > 0 && destAccountGoalsSelectOptions()[0].options.length > 0) {
            <div class="form-control flex flex-col gap-2.5">
              <label for="#destinationGoal" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">
                Meta Destino
              </label>
              <q-select
              [appearence]="['w-full']"
              [dropdownAppearence]="['!w-full']"
              id="destinationGoal"
              formControlName="destinationGoal"
              [groups]="destAccountGoalsSelectOptions()"
              >
                <ng-template #option let-option>
                  <div style="display: flex; align-items: center; gap: 8px">
                    <span>{{ option.label }}</span>
                  </div>
                </ng-template>
              </q-select>
            </div>
          }
        }

        <!-- SUBMIT -->
        <div class="submit">
          <button
          type="submit"
          [disabled]="this.isCreatingTransaction() || this.createTransactionFormGroup.invalid"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium">
            @if(isCreatingTransaction()){
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
export class CreateTransactionComponent implements OnInit {
  defaultAccountId = input<string | undefined>();
  defaultGoalId = input<string | undefined>();

  onSuccess = output<void>();
  createTransactionFormGroup: FormGroup = new FormGroup({});
  isCreatingTransaction = signal<boolean>(false);

  private financeStore = inject(FinanceStore);
  destroyRef = inject(DestroyRef);

  private transactionFacade = inject(TransactionFacade);

  selectedSourceAccount = signal<string | null>(null);
  selectedDestAccount = signal<string | null>(null);

  accountsGroupSelect: Signal<SelectGroup[]> = computed(() => {
    const shared_accounts = this.transactionFacade.shared_accounts().filter(a => a); // some filter if needed. Ex: accounts which user can manage goals
    
    const myAccounts: SelectGroup = {
      label: 'Suas contas',
      options: [...this.transactionFacade.accounts().map(a => ({ label: a.name, value: a.id }))]
    }

    const sharedAccount: SelectGroup = {
      label: 'Partilhas consigo',
      options: [ ...shared_accounts.map(a => ({ label: a.name, value: a.id })) ]
    }

    return [ myAccounts, sharedAccount ]
  })

  sourceAccountGoalsSelectOptions: Signal<SelectGroup[]> = computed(() => {
    const accountId = this.selectedSourceAccount();
    if (!accountId) return [];
    const goals = this.financeStore.goalsByAccountIdMap()[accountId] || [];
    return [
      {
        label: 'Metas da Conta Origem',
        options: goals.map(g => ({ label: g.name, value: g.id }))
      }
    ];
  });

  destAccountGoalsSelectOptions: Signal<SelectGroup[]> = computed(() => {
    const accountId = this.selectedDestAccount();
    if (!accountId) return [];
    const goals = this.financeStore.goalsByAccountIdMap()[accountId] || [];
    return [
      {
        label: 'Metas da Conta Destino',
        options: goals.map(g => ({ label: g.name, value: g.id }))
      }
    ];
  });
  
  accountTypes: Signal<SelectOption[]> = computed(() => {
    return [
      {
        label: 'Ganho',
        value: 'income',
      },
      {
        label: 'Meta para meta',
        value: 'g2g'
      },
      {
        label: 'Gasto',
        value: 'expense'
      }
    ];
  });

  ngOnInit(): void {
    const initialAcc = this.defaultAccountId() || null;
    const initialGoal = this.defaultGoalId() || null;

    this.createTransactionFormGroup = new FormGroup({
      'notes': new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
      'type': new FormControl('income', [Validators.required ]),
      'description': new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ]),
      'amount': new FormControl(null, [ Validators.required ]),
      'sourceAccount': new FormControl(null, [ ]),
      'sourceGoal': new FormControl(null, [ ]),
      'destinationAccount': new FormControl(initialAcc, [ ]),
      'destinationGoal': new FormControl(initialGoal, [ ]),
      'date': new FormControl(new Date().toISOString().substring(0, 10), [ Validators.required ])
    });

    if (initialAcc) {
      this.selectedDestAccount.set(initialAcc);
    }

    // Set initial validators for default type
    this.updateValidators('income');

    // Subscribe to changes to keep validators and selection state in sync
    this.createTransactionFormGroup.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });

    this.createTransactionFormGroup.get('sourceAccount')?.valueChanges.subscribe(value => {
      this.selectedSourceAccount.set(value);
      if (value !== initialAcc) {
        this.createTransactionFormGroup.get('sourceGoal')?.setValue(null);
      }
    });

    this.createTransactionFormGroup.get('destinationAccount')?.valueChanges.subscribe(value => {
      this.selectedDestAccount.set(value);
      if (value !== initialAcc) {
        this.createTransactionFormGroup.get('destinationGoal')?.setValue(null);
      }
    });
  }

  private updateValidators(type: string): void {
    const sourceAcc = this.createTransactionFormGroup.get('sourceAccount')!;
    const sourceGl = this.createTransactionFormGroup.get('sourceGoal')!;
    const destAcc = this.createTransactionFormGroup.get('destinationAccount')!;
    const destGl = this.createTransactionFormGroup.get('destinationGoal')!;

    sourceAcc.clearValidators();
    sourceGl.clearValidators();
    destAcc.clearValidators();
    destGl.clearValidators();

    if (type === 'income') {
      destAcc.setValidators([Validators.required]);
      destGl.setValidators([Validators.required]);
      sourceAcc.setValue(null);
      sourceGl.setValue(null);
    } else if (type === 'expense') {
      sourceAcc.setValidators([Validators.required]);
      sourceGl.setValidators([Validators.required]);
      destAcc.setValue(null);
      destGl.setValue(null);
    } else if (type === 'g2g') {
      sourceAcc.setValidators([Validators.required]);
      sourceGl.setValidators([Validators.required]);
      destAcc.setValidators([Validators.required]);
      destGl.setValidators([Validators.required]);
    }

    sourceAcc.updateValueAndValidity();
    sourceGl.updateValueAndValidity();
    destAcc.updateValueAndValidity();
    destGl.updateValueAndValidity();
  }

  submit(): void {
    if(this.createTransactionFormGroup.invalid) return;
    this.isCreatingTransaction.set(true);

    const type = this.createTransactionFormGroup.get('type')?.value;
    const notes = this.createTransactionFormGroup.get('notes')?.value;
    const description = this.createTransactionFormGroup.get('description')?.value;
    const amount = this.createTransactionFormGroup.get('amount')?.value;
    const date = this.createTransactionFormGroup.get('date')?.value;

    let source: string | null = null;
    let destination: string | null = null;

    if (type === 'income') {
      destination = this.createTransactionFormGroup.get('destinationGoal')?.value || 
                    this.createTransactionFormGroup.get('destinationAccount')?.value;
    } else if (type === 'expense') {
      source = this.createTransactionFormGroup.get('sourceGoal')?.value || 
               this.createTransactionFormGroup.get('sourceAccount')?.value;
    } else if (type === 'g2g') {
      source = this.createTransactionFormGroup.get('sourceGoal')?.value;
      destination = this.createTransactionFormGroup.get('destinationGoal')?.value;
    }

    const createTransactionDto: CreateTransactionDTO = new CreateTransactionDTO(
      notes,
      type,
      amount,
      description,
      date,
      source,
      destination
    );

    this.transactionFacade.create(createTransactionDto).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isCreatingTransaction.set(false))
    ).subscribe({
      next: () => {
        PopupService.success("Transação registada com sucesso!");
        this.createTransactionFormGroup.reset({
          type: 'income',
          date: new Date().toISOString().substring(0, 10),
          destinationAccount: this.defaultAccountId() || null,
          destinationGoal: this.defaultGoalId() || null
        });
        this.onSuccess.emit();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.error?.error || "Erro ao registar transação. Tente novamente.";
        PopupService.error(errorMsg);
      }
    });
  }
}
