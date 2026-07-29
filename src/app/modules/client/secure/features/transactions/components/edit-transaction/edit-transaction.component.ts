import { Component, computed, DestroyRef, inject, input, OnInit, output, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseTransaction } from '@core/models/base-transaction.model';
import { TransactionFacade } from '../../transaction.facade';
import { FinanceStore } from '@core/data/finance-store.data';
import { UpdateTransactionDTO } from '@core/dtos/transaction.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AccountService } from '@client/secure/features/accounts/account.service';
import { Darkable } from '@shared/directives/darkable';
import { SubmitableButton } from '@shared/directives/submitable-button';
import { SelectComponent, SelectGroup, SelectOption } from '@shared/components/forms/select.component';
import { ControlCharCounterUi } from '@shared/ui/input-char-counter/input-char-counter.ui';
import { MoneyInputComponent } from '@shared/components/forms/money-input.component';
import { SpinnerUi } from '@shared/ui/spinner/spinner.ui';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-edit-transaction',
  providers: [TransactionFacade, AccountService],
  imports: [SpinnerUi, SelectComponent, ControlCharCounterUi, MoneyInputComponent, ReactiveFormsModule, Darkable, SubmitableButton],
  template: `
    <div class="panel-body flex gap-5 flex-col">
      <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Editar transação</h1>

      <form (submit)="submit()" [formGroup]="editTransactionFormGroup" class="panel-form flex gap-5 flex-col">
      
        <!-- TÍTULO -->
        <div class="form-control">
          <q-control-char-counter [id]="'notes'" [control]="editTransactionFormGroup.get('notes')!" [limit]="30" [label]="'Título'">
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
          <q-control-char-counter [id]="'description'" [control]="editTransactionFormGroup.get('description')!" [limit]="50" [label]="'Descrição'">
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
        @if (editTransactionFormGroup.get('type')?.value === 'outcome' || editTransactionFormGroup.get('type')?.value === 'g2g') {
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
                Meta Origem {{ editTransactionFormGroup.get('type')?.value === 'g2g' ? '(Obrigatório)' : '(Opcional)' }}
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
        @if (editTransactionFormGroup.get('type')?.value === 'income' || editTransactionFormGroup.get('type')?.value === 'g2g') {
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
                Meta Destino {{ editTransactionFormGroup.get('type')?.value === 'g2g' ? '(Obrigatório)' : '(Opcional)' }}
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
          [disabled]="this.isUpdatingTransaction() || this.editTransactionFormGroup.invalid"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium">
            @if(isUpdatingTransaction()){
              <app-spinner />
            } @else {
              Salvar alterações
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
export class EditTransactionComponent implements OnInit {
  transaction = input.required<BaseTransaction>();
  onSuccess = output<void>();

  editTransactionFormGroup: FormGroup = new FormGroup({});
  isUpdatingTransaction = signal<boolean>(false);

  private financeStore = inject(FinanceStore);
  destroyRef = inject(DestroyRef);
  private transactionFacade = inject(TransactionFacade);

  selectedSourceAccount = signal<string | null>(null);
  selectedDestAccount = signal<string | null>(null);

  accountsGroupSelect: Signal<SelectGroup[]> = computed(() => {
    const shared_accounts = this.transactionFacade.shared_accounts().filter(a => a);
    
    const myAccounts: SelectGroup = {
      label: 'Suas contas',
      options: [...this.transactionFacade.accounts().map(a => ({ label: a.name, value: a.id }))]
    }

    const sharedAccount: SelectGroup = {
      label: 'Partilhas consigo',
      options: [ ...shared_accounts.map(a => ({ label: a.name, value: a.id })) ]
    }

    return [ myAccounts, sharedAccount ];
  });

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
        value: 'outcome'
      }
    ];
  });

  ngOnInit(): void {
    const tx = this.transaction();

    let sourceAccId: string | null = null;
    let sourceGoalId: string | null = null;
    if (tx.source) {
      if (tx.source.type === 'goal') {
        const goal = this.financeStore.goals().find(g => g.id === tx.source!.id);
        sourceAccId = goal?.account_id || null;
        sourceGoalId = tx.source.id;
      } else {
        sourceAccId = tx.source.id;
      }
    }

    let destAccId: string | null = null;
    let destGoalId: string | null = null;
    if (tx.destination) {
      if (tx.destination.type === 'goal') {
        const goal = this.financeStore.goals().find(g => g.id === tx.destination!.id);
        destAccId = goal?.account_id || null;
        destGoalId = tx.destination.id;
      } else {
        destAccId = tx.destination.id;
      }
    }

    this.selectedSourceAccount.set(sourceAccId);
    this.selectedDestAccount.set(destAccId);

    const formattedDate = tx.date ? tx.date.substring(0, 10) : new Date().toISOString().substring(0, 10);

    this.editTransactionFormGroup = new FormGroup({
      'notes': new FormControl(tx.notes || '', [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
      'type': new FormControl(tx.type || 'income', [ Validators.required ]),
      'description': new FormControl(tx.description || '', [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ]),
      'amount': new FormControl(tx.amount || null, [ Validators.required ]),
      'sourceAccount': new FormControl(sourceAccId, [ ]),
      'sourceGoal': new FormControl(sourceGoalId, [ ]),
      'destinationAccount': new FormControl(destAccId, [ ]),
      'destinationGoal': new FormControl(destGoalId, [ ]),
      'date': new FormControl(formattedDate, [ Validators.required ])
    });

    this.updateValidators(tx.type);

    this.editTransactionFormGroup.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });

    this.editTransactionFormGroup.get('sourceAccount')?.valueChanges.subscribe(value => {
      this.selectedSourceAccount.set(value);
      this.editTransactionFormGroup.get('sourceGoal')?.setValue(null);
    });

    this.editTransactionFormGroup.get('destinationAccount')?.valueChanges.subscribe(value => {
      this.selectedDestAccount.set(value);
      this.editTransactionFormGroup.get('destinationGoal')?.setValue(null);
    });
  }

  private updateValidators(type: string): void {
    const sourceAcc = this.editTransactionFormGroup.get('sourceAccount')!;
    const sourceGl = this.editTransactionFormGroup.get('sourceGoal')!;
    const destAcc = this.editTransactionFormGroup.get('destinationAccount')!;
    const destGl = this.editTransactionFormGroup.get('destinationGoal')!;

    sourceAcc.clearValidators();
    sourceGl.clearValidators();
    destAcc.clearValidators();
    destGl.clearValidators();

    if (type === 'income') {
      destAcc.setValidators([Validators.required]);
    } else if (type === 'outcome') {
      sourceAcc.setValidators([Validators.required]);
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
    if(this.editTransactionFormGroup.invalid) return;
    this.isUpdatingTransaction.set(true);

    const type = this.editTransactionFormGroup.get('type')?.value;
    const notes = this.editTransactionFormGroup.get('notes')?.value;
    const description = this.editTransactionFormGroup.get('description')?.value;
    const amount = this.editTransactionFormGroup.get('amount')?.value;
    const date = this.editTransactionFormGroup.get('date')?.value;

    let source: string | null = null;
    let destination: string | null = null;

    if (type === 'income') {
      destination = this.editTransactionFormGroup.get('destinationGoal')?.value || 
                    this.editTransactionFormGroup.get('destinationAccount')?.value;
    } else if (type === 'outcome') {
      source = this.editTransactionFormGroup.get('sourceGoal')?.value || 
               this.editTransactionFormGroup.get('sourceAccount')?.value;
    } else if (type === 'g2g') {
      source = this.editTransactionFormGroup.get('sourceGoal')?.value;
      destination = this.editTransactionFormGroup.get('destinationGoal')?.value;
    }

    const updateTransactionDto: UpdateTransactionDTO = new UpdateTransactionDTO({
      notes,
      type,
      amount,
      description,
      date,
      source,
      destination
    });

    this.transactionFacade.update(this.transaction().id, updateTransactionDto).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isUpdatingTransaction.set(false))
    ).subscribe({
      next: () => {
        PopupService.success("Transação atualizada com sucesso.");
        this.onSuccess.emit();
      },
      error: () => {
        PopupService.error("Erro ao atualizar transação.");
      }
    });
  }
}
