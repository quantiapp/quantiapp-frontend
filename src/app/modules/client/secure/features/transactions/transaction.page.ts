import { Component, computed, inject, Signal, signal, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HeaderPartial } from "@core/partials/client/secure/header.partial";
import { CardTemplate } from "@client/secure/ui/card.template";
import { SelectComponent, SelectGroup, SelectOption } from "@shared/components/forms/select.component";
import { FinanceStore } from '@core/data/finance-store.data';
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { TransactionFacade } from './transaction.facade';
import { TransactionCursor, TransactionMonthGroup } from './models';
import { TransactionItemComponent } from '@shared/components/transactions-container/transaction-item.component';
import { finalize } from 'rxjs';
import { Darkable } from "@shared/directives/darkable";
import { EmptyStateComponent } from '@shared/components/ui/empty-state.component';

@Component({
  selector: 'app-transaction',
  imports: [
    HeaderPartial,
    CardTemplate,
    SelectComponent,
    BarSpinnerUi,
    SubmitableButton,
    ReactiveFormsModule,
    TransactionItemComponent,
    Darkable,
    EmptyStateComponent
],
  template: `
    <div class="section-container py-8 flex flex-col min-h-screen gap-6 limited-container">

      <section class="header">
        <app-header>
          <p class="text-sm font-medium" appDarkable="dark:text-(color:--dm-secondary)">
            O primeiro passo é o mais valioso
          </p>
        </app-header>
      </section>

      <div class="filters">
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
          <app-card>
            <div content>
              <div class="selects flex flex-wrap gap-3">
                <q-select
                [triggerAppearence]="['w-fit', 'px-2!', 'py-1!']"
                id="periods"
                [placeholder]="'Periódo'"
                formControlName="period"
                [options]="periods()"
                >
                  <ng-template #option let-option>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <span class="text-sm">{{ option.label }}</span>
                    </div>
                  </ng-template>
                </q-select>
                <q-select
                [triggerAppearence]="['w-fit', 'px-2!', 'py-1!']"
                id="type"
                [placeholder]="'Tipo'"
                formControlName="type"
                [options]="types()"
                >
                  <ng-template #option let-option>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <span class="text-sm">{{ option.label }}</span>
                    </div>
                  </ng-template>
                </q-select>
                <q-select
                [triggerAppearence]="['w-fit', 'px-2!', 'py-1!']"
                id="account"
                [placeholder]="'Conta'"
                formControlName="account"
                [groups]="accountsGroupSelect()"
                >
                  <ng-template #option let-option>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <span>{{ option.label }}</span>
                    </div>
                  </ng-template>
                </q-select>
                <q-select
                [triggerAppearence]="['w-fit', 'px-2!', 'py-1!']"
                id="origin"
                [placeholder]="'Origem'"
                formControlName="origin"
                [options]="origins()"
                >
                  <ng-template #option let-option>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <span>{{ option.label }}</span>
                    </div>
                  </ng-template>
                </q-select>
                <q-select
                [triggerAppearence]="['w-fit', 'px-2!', 'py-1!']"
                id="destination"
                [placeholder]="'Destino'"
                formControlName="destination"
                [options]="destinations()"
                >
                  <ng-template #option let-option>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <span>{{ option.label }}</span>
                    </div>
                  </ng-template>
                </q-select>
              </div>
              <div class="applier mt-4">
                <button
                type="submit"
                [disabled]="this.isFiltering() || this.isLoadingMore()"
                appSubmitableButton
                tailwindClassBackgroundColor="bg-(color:--primary)/63"
                tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium cursor-pointer">
                  @if(isFiltering()){
                    <app-bar-spinner />
                  } @else {
                    Aplicar filtros
                  }
                </button>
              </div>
            </div>
          </app-card>
        </form>
      </div>

      <div class="transactions-list flex flex-col gap-6">
        @if (isFiltering() && groupedMonths().length === 0) {
          <app-card>
            <div content class="flex justify-center items-center py-8">
              <app-bar-spinner />
            </div>
          </app-card>
        } @else {
          @for (group of groupedMonths(); track group.month.key) {
            <app-card>
              <ng-container header>
                <h3 class="text-base text-(color:--secondary) font-bold" appDarkable="dark:text-(color:--dm-secondary)">
                  {{ group.month.label }}
                </h3>
              </ng-container>
              <ng-container content>
                <div class="transactions">
                  @for (transaction of group.transactions; track transaction.id) {
                    <app-transaction-item [transaction]="transaction" [isLastItem]="$last"></app-transaction-item>
                  }
                </div>
              </ng-container>
            </app-card>
          } @empty {
            <app-empty-state
              [icon]="'horizontal-arrows'"
              [title]="'Nenhuma transação encontrada'"
              [description]="'Registe a sua primeira transação ou ajuste os filtros selecionados para visualizar registos.'"
            ></app-empty-state>
          }

          @if (hasMore() && groupedMonths().length > 0) {
            <div class="load-more flex justify-center">
              <button
              type="submit"
              (click)="loadNextPage()"
              [disabled]="this.isFiltering() || this.isLoadingMore()"
              appSubmitableButton
              tailwindClassBackgroundColor="bg-(color:--primary)/63"
              tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
              class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-3 py-2 font-medium cursor-pointer">
                @if(isLoadingMore()){
                  <app-bar-spinner />
                } @else {
                  Carregar mais transações
                }
              </button>
            </div>
          }
        }
      </div>

    </div>
  `,
  styles: ``
})
export class TransactionPage implements OnInit {
  facade = inject(TransactionFacade);
  financeStore = inject(FinanceStore);

  groupedMonths = signal<TransactionMonthGroup[]>([]);
  nextCursor = signal<TransactionCursor | null>(null);
  hasMore = signal<boolean>(true);
  
  isFiltering = signal<boolean>(false);
  isLoadingMore = signal<boolean>(false);

  filterForm = new FormGroup({
    period: new FormControl<string | null>(null),
    type: new FormControl<string | null>(null),
    account: new FormControl<string | null>(null),
    origin: new FormControl<string | null>(null),
    destination: new FormControl<string | null>(null)
  });
  
  periods = signal<SelectOption[]>([
    {
      label: 'Últimos 7 dias',
      value: 'last-7-days'
    },
    {
      label: 'Este mês',
      value: 'this-month'
    },
    {
      label: 'Últimos 3 meses',
      value: 'last-3 months'
    }
  ]);
  types = signal<SelectOption[]>([
    {
      label: 'Todos',
      value: 'all'
    },
    {
      label: 'Entradas',
      value: 'income'
    },
    {
      label: 'Saídas',
      value: 'outcome'
    },
    {
      label: 'Transferências',
      value: 'g2g'
    }
  ]);

  accountsGroupSelect = computed(() => {
    const shared_accounts = this.financeStore.shared_accounts().filter(a => a);
    
    const myAccounts: SelectGroup = {
      label: 'Suas contas',
      options: [...this.financeStore.accounts().map(a => ({ label: a.name, value: a.id }))]
    }

    const sharedAccount: SelectGroup = {
      label: 'Partilhas consigo',
      options: [ ...shared_accounts.map(a => ({ label: a.name, value: a.id })) ]
    }

    return [ myAccounts, sharedAccount ]
  });

  origins: Signal<SelectOption[]> = computed(() => {
    return this.financeStore.goals().map(goal => ({ label: goal.name, value: goal.id }))
  });

  destinations: Signal<SelectOption[]> = computed(() => {
    return this.financeStore.goals().map(goal => ({ label: goal.name, value: goal.id }));
  });

  ngOnInit(): void {
    this.loadNextPage();
  }

  loadNextPage(): void {
    if (!this.hasMore() || this.isFiltering() || this.isLoadingMore()) {
      return;
    }

    const isFirstPage = this.nextCursor() === null;
    if (isFirstPage) {
      this.isFiltering.set(true);
    } else {
      this.isLoadingMore.set(true);
    }

    this.facade.last(this.nextCursor(), this.filterForm.value).pipe(
      finalize(() => {
        this.isFiltering.set(false);
        this.isLoadingMore.set(false);
      })
    ).subscribe({
      next: (response) => {
        if (!response.data || response.data.length === 0) {
          this.hasMore.set(false);
        } else {
          this.groupedMonths.update(existing => this.mergeMonthGroups(existing, response.data));
          this.nextCursor.set(response.next_cursor);
          if (!response.next_cursor) {
            this.hasMore.set(false);
          }
        }
      },
      error: (err) => {
        console.error('Error loading transactions', err);
      }
    });
  }

  applyFilters(): void {
    this.groupedMonths.set([]);
    this.nextCursor.set(null);
    this.hasMore.set(true);
    this.loadNextPage();
  }

  private mergeMonthGroups(existing: TransactionMonthGroup[], incoming: TransactionMonthGroup[]): TransactionMonthGroup[] {
    const result = existing.map(g => ({
      month: { ...g.month },
      transactions: [...g.transactions]
    }));

    incoming.forEach(inGroup => {
      const extGroup = result.find(g => g.month.key === inGroup.month.key);
      if (extGroup) {
        const txIds = new Set(extGroup.transactions.map(t => t.id));
        inGroup.transactions.forEach(t => {
          if (!txIds.has(t.id)) {
            extGroup.transactions.push(t);
          }
        });
      } else {
        result.push({
          month: { ...inGroup.month },
          transactions: [...inGroup.transactions]
        });
      }
    });

    return result.sort((a, b) => b.month.key.localeCompare(a.month.key));
  }
}
