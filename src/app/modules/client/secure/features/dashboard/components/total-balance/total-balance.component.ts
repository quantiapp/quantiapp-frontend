import { Component, inject, input } from '@angular/core';
import { DialogComponent } from "@shared/components/dialog.component";
import { Darkable } from "@shared/directives/darkable";
import { CardTemplate } from '@client/secure/ui/card.template';
import { DashboardSummary } from '../../models';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency-pipe';
import { DrawerComponent } from "@shared/components/drawer.component";
import { CreateTransactionComponent } from "@client/secure/features/transactions/components/create-transaction/create-transaction.component";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { UserStore } from '@core/data/user-store.data';

@Component({
  selector: 'app-total-balance',
  imports: [CardTemplate, DialogComponent, SubmitableButton, Darkable, CustomCurrencyPipe, DrawerComponent, CreateTransactionComponent],
  template: `
    <app-card>
      <ng-container header>
        <div class="header-content flex justify-between items-center w-full">
          <div class="card-name flex items-center gap-2">
            <p class="text-sm font-medium" appDarkable="dark:text-(color:--dm-secondary)">Balanço Geral</p>
            <button (click)="userStore.toggleBalanceVisibility()" class="cursor-pointer text-(--secondary)/60 hover:text-(--secondary) transition-all p-0.5 rounded-full flex items-center justify-center" appDarkable="dark:text-(--dm-secondary)/60 dark:hover:text-(--dm-secondary)">
              @if (userStore.canSeeBalances()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              }
            </button>
          </div>
          <div class="exchanges">
            <q-dialog>
              <ng-template #invoker let-open="open">
                <button (click)="open()"
                appDarkable="dark:text-(color:--dm-secondary)"
                class="flex justify-center items-center gap-1 bg-(color:--primary)/40 border border-(color:--primary) rounded-[0.313rem] px-[0.438rem] py-1 text-xs font-medium">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.24166 8.61181C3.35382 9.71746 5.29339 11.25 7.50006 11.25C9.70674 11.25 11.6459 9.71746 12.7581 8.61181C13.0514 8.32022 13.1986 8.17392 13.292 7.88763C13.3586 7.68335 13.3586 7.31676 13.292 7.11249C13.1986 6.82618 13.0514 6.67986 12.7581 6.38823C11.6459 5.28259 9.70674 3.75002 7.50006 3.75002C5.29339 3.75002 3.35382 5.28259 2.24166 6.38823C1.94812 6.68006 1.80134 6.82608 1.70791 7.11248C1.64127 7.31676 1.64127 7.68335 1.70791 7.88763C1.80134 8.17403 1.94812 8.31999 2.24166 8.61181Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6.24994 7.50005C6.24994 8.19041 6.80959 8.75006 7.49995 8.75006C8.19031 8.75006 8.74996 8.19041 8.74996 7.50005C8.74996 6.80969 8.19031 6.25004 7.49995 6.25004C6.80959 6.25004 6.24994 6.80969 6.24994 7.50005Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Taxas de câmbio
                </button>
              </ng-template>
              <ng-template #panel let-close="close">
                <div class="dialog-panel flex flex-col gap-6 p-4">
                  <div class="dialog-header flex justify-center items-center">
                    <svg width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M37.4937 14.9848C34.6275 11.5561 30.3185 9.375 25.5 9.375C16.8705 9.375 9.875 16.3705 9.875 25C9.875 26.0669 9.98194 27.109 10.1857 28.1158M40.7092 21.4037C40.981 22.5583 41.125 23.7623 41.125 25C41.125 33.6294 34.1294 40.625 25.5 40.625C20.5287 40.625 16.0996 38.3033 13.2379 34.6852" stroke="#F1C40F" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M38.2604 11.4583V15.625H34.0938" stroke="#F1C40F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16.9062 34.375H12.7396V38.5417" stroke="#F1C40F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M25.5 16.6667V33.3333" stroke="#F1C40F" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M29.2712 21.1492C29.0219 20.045 27.5971 18.816 25.5131 18.816C23.4294 18.816 21.8262 20.1697 21.8262 21.8796C21.8262 25.7623 29.5562 23.7675 29.5562 28.2735C29.5562 29.9023 27.5969 31.2835 25.5131 31.2835C23.4296 31.2835 21.9864 30.0013 21.5591 28.6298" stroke="#F1C40F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="dialog-body flex flex-col gap-6">
                    <div class="head flex justify-between items-center">
                      <h2 class="text-base font-bold text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Taxas de câmbio</h2>
                      <h2 class="text-base font-bold text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">{{ summary().exchanges.user_currency.code }}</h2>
                    </div>
                    <div class="exchanges flex flex-col gap-3">
                      @for (conversion of summary().exchanges.conversions; track $index) {
                        <div class="exchange flex justify-between items-center">
                          <p class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">1 {{ conversion.from }}</p>
                          <p class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">{{ conversion.value | money: '1.0-6' }}</p>
                        </div>
                      } @empty {
                        <p class="text-sm text-center text-(color:--secondary)/60 font-medium py-2" appDarkable="dark:text-(color:--dm-secondary)/60">
                          Não existem taxas de câmbio ativas porque todas as tuas contas utilizam a tua moeda padrão ({{ summary().exchanges.user_currency.code }}).
                        </p>
                      }
                    </div>
                  </div>
                  <div class="dialog-footer flex justify-end items-center">
                    <button (click)="close()" appSubmitableButton
                    tailwindClassBackgroundColor="bg-(color:--primary)/63"
                    tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                    class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium text-(--secondary)"
                    appDarkable="dark:text-(--secondary)">
                      Fechar
                    </button>
                  </div>
                </div>
              </ng-template>
            </q-dialog>
          </div>
        </div>
      </ng-container>
      <ng-container content>
        <div class="card-content">
          <p class="text-[1.688rem] font-bold text-(color:--secondary) value-text-shadow" appDarkable="dark:text-(color:--dm-secondary)">
            {{ summary().exchanges.user_currency.code }} {{ userStore.canSeeBalances() ? (summary().total_balance | money) : '**********,00' }}
          </p>
        </div>
      </ng-container>
      <ng-container foot>
        <q-drawer class="w-full">
          <ng-template #invoker let-open="open">
            <button (click)="open()" class="w-full text-base font-bold flex gap-2 justify-center items-center bg-(color:--primary) text-(color:--secondary) rounded-full px-4 py-[0.625rem]">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 12.0001H12.5M12.5 12.0001H16.5M12.5 12.0001V16.0001M12.5 12.0001V8.0001M12.5 21.0001C7.52944 21.0001 3.5 16.9707 3.5 12.0001C3.5 7.02954 7.52944 3.0001 12.5 3.0001C17.4706 3.0001 21.5 7.02954 21.5 12.0001C21.5 16.9707 17.4706 21.0001 12.5 21.0001Z" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Adicionar
            </button>
          </ng-template>
          <ng-template #panel let-close="close">
            <app-create-transaction (onSuccess)="close()"></app-create-transaction>
          </ng-template>
        </q-drawer>
      </ng-container>
    </app-card>
  `,
  styles: ``
})
export class TotalBalanceComponent {
  summary = input.required<DashboardSummary>();
  public userStore = inject(UserStore);
}
