import { Component, input } from '@angular/core';
import { CardTemplate } from "@client/secure/ui/card.template";
import { RouterLink } from "@angular/router";
import { NoDataMessageUi } from "@shared/ui/no-data-message/no-data-message.ui";
import { DashboardAccount, DashboardGoal, DashboardTransaction } from '../../models';
import { NgxMaskPipe } from 'ngx-mask';
import { TailwindClassApplier } from '@shared/directives/tailwind-class-applier';
import { Darkable } from '@shared/directives/darkable';
import { CoinSpinnerUi } from "@shared/ui/coin-spinner/coin-spinner.ui";
import { TransactionPrefixPipe } from '@shared/pipes/transaction-prefix-pipe';
import { TransactionColorPipe } from '@shared/pipes/transaction-color-pipe';
import { TransactionExchangePipe } from '@shared/pipes/transaction-exchange-pipe';

@Component({
  selector: 'app-dashboard-transactions',
  imports: [CardTemplate, RouterLink, NoDataMessageUi, NgxMaskPipe, TailwindClassApplier, Darkable, CoinSpinnerUi, TransactionPrefixPipe, TransactionColorPipe, TransactionExchangePipe],
  template: `
    <app-card>
      <ng-container header>
        <div class="section-header flex justify-between items-center">
          <h3 class="text-base text-(color:--secondary) font-bold" appDarkable="dark:text-(color:--dm-secondary)">
            Transações
          </h3>
          <a [routerLink]="" class="text-(color:--secondary) flex gap-1 justify-center items-center text-sm font-medium"
          appDarkable="dark:text-(color:--dm-secondary)"
          >
            Ver todas
          </a>
        </div>
      </ng-container>
      <ng-container content>
        @if(!isLoading()){
          <div class="transactions">
            @for (transaction of transactions(); track $index) {
              <div class="item flex gap-2 justify-between items-stretch pt-4 not-[:last-child]:pb-4 not-[:last-child]:border-b not-[:last-child]:border-[#F2F2F2]">
                <div class="icon-container">
                  <div class="icon w-10 h-10 rounded-[0.625rem] flex justify-center items-center border border-black/12" appTailwindClassApplier [tailwindClassesArray]="['dark:border-white/12']">
                    @switch (transaction.type) {
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
                <div class="main-details flex flex-col justify-between gap-1 w-[179px]">
                  <p class="description text-sm line-clamp-3" appDarkable="dark:text-(color:--dm-secondary)">{{ transaction.description }}</p>
                  <div class="targets flex gap-[0.625rem] justify-start items-center">
                    @switch (transaction.type) {
                      @case ('g2g') {
                        <p class="origin text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)"> {{ transaction.origin?.account?.name ?? 'Conta não identificada' }} </p>
                        <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 0.5L4 3.5L1 6.5" stroke="gray" stroke-opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p class="destination text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)"> {{ transaction.destination?.account?.name ?? 'Conta não identificada' }} </p>
                      }
                      @case ('income') {
                        <p class="source text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)"> {{ transaction.destination?.account?.name ?? 'Conta não identificada' }} </p>
                      }
                      @case ('outcome') {
                        <p class="source text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)"> {{ transaction.origin?.account?.name ?? 'Conta não identificada' }} </p>
                      }
                    }
                  </div>
                </div>
                <div class="secondary-details flex flex-col justify-between items-end w-full max-w-[82px]">
                  <div class="currency flex gap-[5px] justify-end items-center">
                    @if(transaction.origin_currency.code !== transaction.destination_currency.code) {
                      <p class="origin text-xs font-medium text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)"> {{ transaction.origin_currency.code }} </p>
                      <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 0.5L4 3.5L1 6.5" stroke="gray" stroke-opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    }
                    <p class="destination text-xs font-medium text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)"> {{ transaction.destination_currency.code }} </p>
                  </div>
                  <div class="amount">
                    <p class="text-xs font-bold" [style.color]="transaction | transactionColor: this.dependencies()">
                      {{ transaction | transactionPrefix: this.dependencies() }}{{ transaction | transactionExchange: this.dependencies() | mask: 'separator.2' }}
                    </p>
                  </div>
                  <div class="date">
                    <p class="text-xs text-(color:--secondary)/60" appDarkable="dark:text-(color:--dm-secondary)"> {{ transaction.date.short }} </p>
                  </div>
                </div>
              </div>
            } @empty {
              <no-data-message />
            }
          </div>
        } @else {
          <coin-spinner />
        }
      </ng-container>
    </app-card>
  `,
  styles: ``
})
export class TransactionsComponent {
  isLoading = input.required<boolean>();
  dependencies = input.required<{ account: DashboardAccount, goal: DashboardGoal }>();
  transactions = input.required<DashboardTransaction[]>();

  // transactionStatus(type: string, get: 'operator' | 'color'): string {
  //   const transactionState
  // }

}
