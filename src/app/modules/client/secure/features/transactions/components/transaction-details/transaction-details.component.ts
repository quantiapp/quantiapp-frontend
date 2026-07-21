import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { BaseTransaction, EntityReference } from '@core/models/base-transaction.model';
import { Darkable } from '@shared/directives/darkable';
import { TailwindClassApplier } from '@shared/directives/tailwind-class-applier';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency-pipe';
import { FormatDatePipe } from '@shared/pipes/format-date-pipe';
import { TransactionColorPipe } from '@shared/pipes/transaction-color-pipe';
import { TransactionExchangePipe } from '@shared/pipes/transaction-exchange-pipe';
import { TransactionPrefixPipe } from '@shared/pipes/transaction-prefix-pipe';
import { FinanceStore } from '@core/data/finance-store.data';
import { WordReplacerPipe } from '@shared/pipes/word-replacer-pipe';
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { TransactionRatesPipe } from '@shared/pipes/transaction-rates-pipe';
import { UsernameResolverPipe } from '@shared/pipes/username-resolver-pipe';
import { SubmitableButton } from "@shared/directives/submitable-button";
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { PopupService } from '@core/services/pop-up.service';
import { TransactionFacade } from '@client/secure/features/transactions/transaction.facade';
import { finalize } from 'rxjs';
import { UserStore } from '@core/data/user-store.data';
import { DrawerComponent } from '@shared/components/drawer.component';
import { EditTransactionComponent } from '../edit-transaction/edit-transaction.component';

@Component({
  selector: 'app-transaction-details',
  imports: [
    TransactionColorPipe,
    TransactionExchangePipe,
    TransactionPrefixPipe,
    Darkable,
    FormatDatePipe,
    CustomCurrencyPipe,
    TailwindClassApplier,
    WordReplacerPipe,
    IconContainerContainer,
    TransactionRatesPipe,
    UsernameResolverPipe,
    SubmitableButton,
    BarSpinnerUi,
    DrawerComponent,
    EditTransactionComponent
],
  template: `
    <div class="details-content flex gap-5 flex-col">
      <div class="main-details flex flex-col gap-2.5">
        <h1 class="text-lg font-medium" appDarkable="dark:text-(color:--dm-secondary)">
          {{ transaction().description }}
        </h1>
        <p class="date text-sm text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">
          {{ transaction().date | formatDate: 'long'}}
        </p>

        @let origin_name = transaction().source ? transaction().source?.name : 'Origem externa';
        @let destination_name = transaction().destination ? transaction().destination?.name : 'Destino externo';
        @let origin_account_name = transaction().source ? transaction().source?.account_name : 'Origem externa';
        @let destination_account_name = transaction().destination ? transaction().destination?.account_name : 'Destino externo';
        @let source_currency_code = transaction().source ? financeStore().currenciesMap()[transaction().source?.currency_id!].code : null;
        @let destination_currency_code = transaction().destination !== null ? financeStore().currenciesMap()[transaction().destination?.currency_id!].code : null;
        @let origin_color = transaction().source ? transaction().source?.color : '';
        @let destination_color = transaction().destination ? transaction().destination?.color : '';

        @if(source_currency_code !== destination_currency_code && (source_currency_code && destination_currency_code)) {
          <div class="multi-values flex gap-2.5 items-center justify-start" appDarkable="dark:text-(color:--dm-secondary)/30">
            <p class="text-base font-bold !text-[#E2060A]">
              {{ transaction().amount | money }} {{ source_currency_code }}
            </p>
            <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 0.5L3.5 3.5L0.5 6.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="text-base font-bold !text-[#00A751]">
              {{ transaction() | transactionExchange | money }} {{ destination_currency_code }}
            </p>
          </div>

        } @else {
          <p class="text-base font-bold" [style.color]="transaction() | transactionColor">
            {{ transaction() | transactionPrefix }}{{ transaction() | transactionExchange | money }} {{ source_currency_code ?? destination_currency_code }}
          </p>
        }

        <div class="transaction-type-block border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex gap-4 justify-start items-stretch">
          <div class="icon-container">
            <div class="icon w-10 h-10 rounded-[0.625rem] flex justify-center items-center border border-black/12" appTailwindClassApplier [tailwindClassesArray]="['dark:border-white/12']">
              @switch (transaction().type) {
                @case ('g2g') {
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.999832 1.88892H7.22593C7.62968 1.88892 7.83071 1.88892 8.0121 1.94684C8.17263 1.99811 8.32118 2.082 8.44772 2.19328C8.59072 2.31902 8.69475 2.49219 8.90247 2.8384L11.9995 8.00007L15.0965 13.1617C15.3042 13.5079 15.4082 13.6808 15.5512 13.8066C15.6777 13.9178 15.8258 14.0019 15.9863 14.0532C16.1676 14.1111 16.3709 14.1111 16.7741 14.1111H23.0002M15.6664 1.88892H22.9998" stroke="#4AA4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }
                @case ('income') {
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.0005 1L11.1543 6.9375C11.0493 7.04414 10.9962 7.09757 10.9492 7.13964C10.1899 7.81931 9.04159 7.81932 8.28223 7.13965C8.23522 7.09757 8.18173 7.04419 8.07668 6.93749C7.97163 6.8308 7.91908 6.77743 7.87207 6.73535C7.11271 6.05568 5.96397 6.05568 5.20461 6.73535C5.15771 6.77733 5.10532 6.83053 5.00078 6.93671L1 11M17.0005 1L17 7M17.0005 1H11" stroke="#00A751" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }
                @case ('outcome') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.0005 17L14.1543 11.0625C14.0493 10.9559 13.9962 10.9024 13.9492 10.8604C13.1899 10.1807 12.0416 10.1807 11.2822 10.8604C11.2352 10.9024 11.1817 10.9558 11.0767 11.0625C10.9716 11.1692 10.9191 11.2226 10.8721 11.2646C10.1127 11.9443 8.96397 11.9443 8.20461 11.2646C8.15759 11.2226 8.10506 11.1692 8 11.0625L4 7M20.0005 17L20 11M20.0005 17H14" stroke="#E2060A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }
              }
            </div>
          </div>
          <div class="block-content flex flex-col justify-between gap-1">
            <p class="description text-sm line-clamp-3" appDarkable="dark:text-(color:--dm-secondary)">
              @if(transaction().type === 'g2g') {
                Movimentação entre metas
              }
              @else if(transaction().type === 'income') {
                Entrada de dinheiro
              }
              @else {
                Saída de dinheiro
              }
            </p>
            <div class="targets flex gap-[0.625rem] justify-start items-center">
              @switch (transaction().type) {
                @case ('g2g') {
                  <p class="origin text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60"> {{ origin_name! | wordReplacer:'Banco ': '' }} </p>
                  <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 0.5L4 3.5L1 6.5" stroke="gray" stroke-opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <p class="destination text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60"> {{ destination_name! | wordReplacer:'Banco ': '' }} </p>
                }
                @case ('income') {
                  <p class="source text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60"> {{ destination_name }} </p>
                }
                @case ('outcome') {
                  <p class="source text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60"> {{ origin_name }} </p>
                }
              }
            </div>
          </div>
        </div>

      </div>

      <div class="affected-accounts flex flex-col gap-4">
        <div class="affected-block border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex flex-col gap-4">
          <div class="aff flex gap-4 justify-start items-stretch">
            <div class="icon-container">
              <div class="icon w-10 h-10 rounded-[0.625rem] flex justify-center items-center border border-black/12" appTailwindClassApplier [tailwindClassesArray]="['dark:border-white/12', 'dark:text-(color:--dm-secondary)']">
                <app-icon-container [width]="30" [height]="30" [key]="'card'"></app-icon-container>
              </div>
            </div>
            <div class="block-content w-full flex flex-col justify-between gap-1">
              <p class="description text-sm line-clamp-3" appDarkable="dark:text-(color:--dm-secondary)">
                Contas afetadas
              </p>
              <div class="targets flex gap-2 justify-start items-center">
                @switch (transaction().type) {
                  @case ('g2g') {
                    @if (origin_account_name === destination_account_name) {
                      <p class="origin text-xs py-1 px-2 rounded uppercase text-white" [style.backgroundColor]="origin_color"> {{ origin_account_name! | wordReplacer:'Banco ': '' }} </p>
                    } @else {
                      <p class="origin text-xs py-1 px-2 rounded uppercase text-white" [style.backgroundColor]="origin_color"> {{ origin_account_name! | wordReplacer:'Banco ': '' }} </p>
                      <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 0.5L4 3.5L1 6.5" stroke="gray" stroke-opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <p class="destination text-xs py-1 px-2 rounded uppercase text-white" [style.backgroundColor]="destination_color"> {{ destination_account_name! | wordReplacer:'Banco ': '' }} </p>
                    }
                  }
                  @case ('income') {
                    <p class="destination text-xs py-1 px-2 rounded uppercase text-white" [style.backgroundColor]="destination_color"> {{ destination_account_name }} </p>
                  }
                  @case ('outcome') {
                    <p class="source text-xs py-1 px-2 rounded uppercase text-white" [style.backgroundColor]="origin_color"> {{ origin_account_name }} </p>
                  }
                }
              </div>
            </div>
          </div>

          @if(sharedAccounts().length > 0){
            <div class="shared-accounts">
              <div class="shared-block border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex gap-4 justify-start items-stretch">
                <div class="block-content flex flex-col justify-between gap-2">
                  <p class="description text-sm line-clamp-3" appDarkable="dark:text-(color:--dm-secondary)">
                    Contas partilhadas envolvidas
                  </p>
                  @for (shared_account of sharedAccounts(); track $index) {
                    <div class="targets flex flex-col gap-0 justify-start items-start">
                      <p class="account text-sm font-bold uppercase" [style.color]="shared_account.color"> {{ shared_account.account_name }}: </p>
                      <p class="proprietary text-sm text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">
                        <!-- <span class="font-bold text-sm">Proprietário:</span> -->
                        {{ shared_account.owner }}
                      </p>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      @if(source_currency_code !== destination_currency_code && (source_currency_code && destination_currency_code)) {
      <div class="rate-block border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex flex-col gap-4">
        <div class="rate flex gap-4 justify-start items-stretch">
          <div class="icon-container">
            <div class="icon w-10 h-10 rounded-[0.625rem] flex justify-center items-center border border-black/12" appTailwindClassApplier [tailwindClassesArray]="['dark:border-white/12', 'dark:text-(color:--dm-secondary)']">
              <app-icon-container [width]="30" [height]="30" [key]="'dolar'" [colorAttr]="'fill'"></app-icon-container>
            </div>
          </div>
          <div class="block-content w-full flex flex-col justify-between gap-1">
            <p class="description text-sm line-clamp-3" appDarkable="dark:text-(color:--dm-secondary)">
              Taxa de câmbio da transação
            </p>
            <div class="rates flex gap-2 justify-start items-center">
              <p class="origin text-xs rounded uppercase text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60"> 1 {{ source_currency_code }} </p>
              <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.5L4 3.5L1 6.5" stroke="gray" stroke-opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="destination text-xs rounded uppercase text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60"> {{ transaction() | transactionRatesPipe | money: '1.0-6' }} {{ destination_currency_code }} </p>
            </div>
          </div>
        </div>
      </div>
      }

      <div class="register-block border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex flex-col gap-4">
        <div class="register flex gap-4 justify-start items-stretch">
          <div class="icon-container">
            <div class="icon w-10 h-10 rounded-[0.625rem] flex justify-center items-center border border-black/12" appTailwindClassApplier [tailwindClassesArray]="['dark:border-white/12', 'dark:text-(color:--dm-secondary)']">
              <app-icon-container [width]="30" [height]="30" [key]="'user'" [colorAttr]="'stroke'"></app-icon-container>
            </div>
          </div>
          <div class="block-content w-full flex flex-col justify-between gap-1">
            <p class="description text-sm line-clamp-3" appDarkable="dark:text-(color:--dm-secondary)">
              Transação efectuada por
            </p>
            <div class="rates flex gap-2 justify-start items-center">
              <p class="origin text-xs rounded text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">
                {{ transaction().register.email | usernameResolver }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="description flex flex-col gap-2.5">
        <label class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Descrição</label>
        <div class="description-block border border-black/5 dark:border-white/5 rounded-[10px] w-full px-4 py-2.5 flex gap-4 justify-start items-stretch">
          <div class="block-content h-[70px] overflow-y-auto flex flex-col justify-between gap-2">
            <p class="description text-sm" appDarkable="dark:text-(color:--dm-secondary)/60">
              {{ transaction().description }}
            </p>
          </div>
        </div>
      </div>

      @if(canDelete()){
        <div class="edit-transaction flex flex-col gap-1">
          <h3 class="text-sm text-(color:--secondary)/60 py-2" appDarkable="dark:text-(--dm-secondary)/60">Editar transação</h3>
          <div class="edit-block border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex flex-col gap-4">
            <q-drawer>
              <ng-template #invoker let-open="open">
                <button (click)="open()" class="edit-btn flex w-full justify-between items-center text-left">
                  <div class="flex gap-4 items-center">
                    <div class="icon w-10 h-10 rounded-[0.625rem] flex justify-center items-center border border-black/12" appTailwindClassApplier [tailwindClassesArray]="['dark:border-white/12', 'dark:text-(color:--dm-secondary)']">
                      <app-icon-container [width]="24" [height]="24" [key]="'edit'" [colorAttr]="'fill'"></app-icon-container>
                    </div>
                    <div class="block-content flex flex-col">
                      <p class="description text-sm font-medium" appDarkable="dark:text-(color:--dm-secondary)">
                        Editar detalhes
                      </p>
                      <p class="text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)/60">
                        Alterar valores, conta ou tipo da transação
                      </p>
                    </div>
                  </div>
                  <div class="arrow w-8 h-8 flex justify-center items-center text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.35535L5 5.35535L1 9.35535" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </button>
              </ng-template>
              <ng-template #panel let-close="close">
                <app-edit-transaction [transaction]="transaction()" (onSuccess)="close()"></app-edit-transaction>
              </ng-template>
            </q-drawer>
          </div>
        </div>

        <div class="delete-transaction flex flex-col gap-1">
          <h3 class="text-sm text-(color:--secondary)/60 py-2" appDarkable="dark:text-(--dm-secondary)/60">Eliminar transação</h3>
          <button
            type="submit"
            (click)="delete()"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-[#FF252A]/60"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(255,37,42,25%)]"
            class="w-full text-sm border border-[#B6070B]/40 rounded-[0.563rem] px-2.5 text-center py-1.5 font-medium"
            [disabled]="isDeletingTransaction()">
              @if(isDeletingTransaction()) {
                <app-bar-spinner></app-bar-spinner>
              } @else {
                Eliminar transação
              }
          </button>
        </div>
      }

    </div>
  `,
  styles: ``
})
export class TransactionDetailsComponent {
  transaction = input.required<BaseTransaction>();
  financeStore = input.required<FinanceStore>();

  private userStore = inject(UserStore);
  private transactionFacade = inject(TransactionFacade);

  isDeletingTransaction = signal<boolean>(false);

  sharedAccounts = computed(() => {
    const transaction = this.transaction();
    const sourceOnwer = transaction.source?.owner;
    const destinatinoOwner = transaction.destination?.owner;
    let entities: EntityReference[] = [];
    
    if(sourceOnwer){
      entities.push(transaction.source as EntityReference);
    }

    if(destinatinoOwner) {
      entities.push(transaction.destination as EntityReference);
    }

    return entities;
  });

  canDelete = computed(() => {

    const user = this.userStore.user();
    if(!user) return false;

    const transaction = this.transaction();

    if(transaction.register.email === user.email) return true;

    const isSourceUserAccount = transaction.source ? (!transaction.source.owner || transaction.source.owner === user.name) : false;
    const isDestinationUserAccount = transaction.destination ? (!transaction.destination.owner || transaction.destination.owner === user.name) : false;

    return isSourceUserAccount || isDestinationUserAccount;

  });

  delete(): void {
    if(this.isDeletingTransaction()) return;

    PopupService.confirm(
      "Ao remover esta transação irá remover também todos os seus dados. Deseja continuar mesmo assim?",
      () => this.onConfirm()
    );
  }

  private onConfirm(): void {
    this.isDeletingTransaction.set(true);
    this.transactionFacade.delete(this.transaction().id).pipe(finalize(() => this.isDeletingTransaction.set(false))).subscribe({
      next: response => {
        PopupService.success("Transação removida com êxito.");
      },
      error: error => {}
    })
  }
}
