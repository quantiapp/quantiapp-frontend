import { Component, signal } from '@angular/core';
import { HeaderPartial } from "../../../../../core/partials/client/secure/header.partial";
import { CardTemplate } from "@client/secure/ui/card.template";
import { NgxMaskPipe } from 'ngx-mask';
import { RouterLink } from '@angular/router';
import { ScrollerComponent } from "@shared/components/scroller.component";
import { Darkable } from "@shared/directives/darkable";
import { HtmlSanitizerPipe } from '@shared/pipes/html-sanitizer-pipe';
import { TotalBalanceComponent } from './components/total-balance/total-balance.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderPartial, CardTemplate, NgxMaskPipe, RouterLink, ScrollerComponent, Darkable, TotalBalanceComponent, HtmlSanitizerPipe],
  template: `
    <div class="section-container py-14 flex flex-col gap-6 limited-container">

      <section class="header">
        <app-header>
          <p class="text-sm font-medium" appDarkable="dark:text-(color:--dm-secondary)">
            O primeiro passo é o mais valioso
          </p>
        </app-header>
      </section>

      <section class="total-balance">
        <app-total-balance></app-total-balance>
      </section>

      <section class="accounts flex flex-col gap-5">
        <div class="section-header flex justify-between items-center">
          <h3 class="text-base text-(color:--secondary) font-medium" appDarkable="dark:text-(color:--dm-secondary)">Seus cartões</h3>
          <a [routerLink]="" class="text-(color:--secondary) flex gap-1 justify-center items-center text-sm font-medium"
           appDarkable="dark:text-(color:--dm-secondary)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Novo cartão
          </a>
        </div>
        <div class="section-content">
          <q-scroller (active)="activeAccount.set($event)" [itemsArray]="accounts()">
            <ng-template #item let-item>
              <app-card [tailwindClassesArray]="['!w-[17.5rem]']">
                <ng-container header>
                  <div class="header-content flex justify-between items-center">
                    <div class="card-name">
                      <p class="text-sm font-medium capitalize" appDarkable="dark:text-(color:--dm-secondary)">{{ item.name }}</p>
                    </div>
                    <div class="exchanges">
                      <p class="text-sm font-medium uppercase" appDarkable="dark:text-(color:--dm-secondary)">
                        {{ item.settings.currency.code }}
                      </p>
                    </div>
                  </div>
                </ng-container>
                <ng-container content>
                  <div class="card-content flex flex-col gap-2">
                    <p class="text-sm text-(color:--secondary)/60 capitalize" appDarkable="dark:text-(color:--dm-secondary)/70">
                      {{ item.type.description }}
                    </p>
                    <p
                    class="text-[1.688rem] font-bold text-shadow-[0px_3px_4px_rgba(0,0,0,0.12)]"
                    [style.color]="item.settings.color"
                    appDarkable="dark:text-(color:--dm-secondary)"
                    >
                      {{ item.amount | mask: 'separator.2' : { thousandSeparator: '.', decimalMarker: ',' } }}
                    </p>
                  </div>
                </ng-container>
                <ng-container foot>
                  <div class="ctas flex gap-[0.625rem] flex-wrap justify-start items-center">
                    <a href="" class="text-sm flex gap-1 justify-center items-center text-white rounded-full px-2 py-2" [style.background-color]="item.settings.color">
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 12.0001H12.5M12.5 12.0001H16.5M12.5 12.0001V16.0001M12.5 12.0001V8.0001M12.5 21.0001C7.52944 21.0001 3.5 16.9707 3.5 12.0001C3.5 7.02954 7.52944 3.0001 12.5 3.0001C17.4706 3.0001 21.5 7.02954 21.5 12.0001C21.5 16.9707 17.4706 21.0001 12.5 21.0001Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Adicionar
                    </a>
                    <a href="" class="text-sm flex gap-1 justify-center items-center bg-white text-(color:--secondary) border border-(color:--secondary)/10 rounded-full px-2 py-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Detalhes
                    </a>
                  </div>
                </ng-container>
              </app-card>
            </ng-template>
          </q-scroller>
        </div>
      </section>

      <section class="goals flex flex-col gap-5">
        <div class="section-header w-full flex justify-between items-center">
          <h3 class="text-base text-(color:--secondary) font-medium" appDarkable="dark:text-(color:--dm-secondary)">
            Suas metas
          </h3>
          <a [routerLink]="" class="text-(color:--secondary) flex gap-1 justify-center items-center text-sm font-medium"
           appDarkable="dark:text-(color:--dm-secondary)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Nova meta
          </a>
        </div>
        <div class="section-content">
          <q-scroller [itemsArray]="goals()">
            <ng-template #item let-item>
              <app-card [tailwindClassesArray]="['!w-[17.5rem]']">
                <ng-container header>
                  <div class="header-content flex justify-between items-center">
                    <div class="card-name">
                      <p class="text-sm font-medium capitalize" appDarkable="dark:text-(color:--dm-secondary)">
                        {{ item.name }}
                      </p>
                    </div>
                    <div class="icon p-1 rounded duration-[.3s]" [style.background-color]="this.accounts()[this.activeAccount()].settings.color" [innerHTML]="item.icon.embedded_svg | htmlSanitizer">
                    </div>
                  </div>
                </ng-container>
                <ng-container content>
                  <div class="card-content flex flex-col gap-2">
                    <div class="details flex justify-between items-center">
                      <p class="text-xs font-medium uppercase duration-[.3s]"
                      [style.color]="this.accounts()[this.activeAccount()].settings.color">
                        {{ this.accounts()[this.activeAccount()].settings.currency.code }}
                      </p>
                      <p class="text-xs text-(color:--secondary)/60 capitalize" appDarkable="dark:text-(color:--dm-secondary)/70">
                        Último movimento: 
                        <span [class]="(item.latest_transaction[0].type == 'income' || item.latest_transaction[0].destination === item.id) ? 'text-[#00A751]' :  'text-[#E2060A]'">
                        {{ (item.latest_transaction[0].type == 'income' || item.latest_transaction[0].destination === item.id) ? '+' :  '-' }}{{ item.latest_transaction[0].amount | mask: 'separator.2' : { thousandSeparator: '.', decimalMarker: ',' } }}
                        </span>
                      </p>
                    </div>
                    <div class="progress">
                      <div class="numbers flex justify-between items-end">
                        <div class="percentage">
                          <p
                          class="text-xl font-bold text-[#202020]/20"
                          >
                          <!-- [style.color]="this.accounts()[this.activeAccount()].settings.color"
                          appDarkable="dark:text-(color:--dm-secondary)" -->
                            <span class=" duration-[.3s]" [style.color]="this.accounts()[this.activeAccount()].settings.color">
                              {{ item.progress | mask: 'percent' : { suffix: '%' } }}
                            </span>
                          </p>
                        </div>
                        <div class="achievements text-xs font-medium">
                          <p
                          class=" text-[#202020]/60 duration-[.3s]"
                          appDarkable="dark:text-(color:--dm-secondary)"
                          >
                            <span class="" [style.color]="this.accounts()[this.activeAccount()].settings.color">
                              {{ item.amount | mask: 'separator.2' : { thousandSeparator: '.', decimalMarker: ',' } }}
                            </span>
                            / {{ item.achievement | mask: 'separator.2' : { thousandSeparator: '.', decimalMarker: ',' } }}
                          </p>
                        </div>
                      </div>
                      <div class="progress-track mt-2">
                        <div class="thumb bg-[#F2F2F2] rounded-full w-full h-2 overflow-hidden">
                          <div class="tracker h-full duration-[.3s]" [style.max-width.%]="item.progress" [style.background-color]="this.accounts()[this.activeAccount()].settings.color"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ng-container>
                <ng-container foot>
                  <div class="ctas flex gap-[0.625rem] flex-wrap justify-start items-center">
                    <a href="" class="text-sm flex gap-1 justify-center items-center text-white rounded-full px-2 py-2 duration-[.3s]" [style.background-color]="this.accounts()[this.activeAccount()].settings.color">
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 12.0001H12.5M12.5 12.0001H16.5M12.5 12.0001V16.0001M12.5 12.0001V8.0001M12.5 21.0001C7.52944 21.0001 3.5 16.9707 3.5 12.0001C3.5 7.02954 7.52944 3.0001 12.5 3.0001C17.4706 3.0001 21.5 7.02954 21.5 12.0001C21.5 16.9707 17.4706 21.0001 12.5 21.0001Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Adicionar
                    </a>
                    <a href="" class="text-sm flex gap-1 justify-center items-center bg-white text-(color:--secondary) border border-(color:--secondary)/10 rounded-full px-2 py-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Detalhes
                    </a>
                  </div>
                </ng-container>
              </app-card>
            </ng-template>
          </q-scroller>
        </div>
      </section>

      <section class="latest-transactions">
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
            <div class="transactions">
              @for (transaction of latest_transactions(); track $index) {
                <div class="item flex gap-2 justify-between items-start">
                  <div class="icon w-10 h-10 rounded-[0.625rem] flex justify-center items-center border border-black/12">
                    @switch (transaction.type) {
                      @case ('g2g') {
                        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.999832 1.88892H7.22593C7.62968 1.88892 7.83071 1.88892 8.0121 1.94684C8.17263 1.99811 8.32118 2.082 8.44772 2.19328C8.59072 2.31902 8.69475 2.49219 8.90247 2.8384L11.9995 8.00007L15.0965 13.1617C15.3042 13.5079 15.4082 13.6808 15.5512 13.8066C15.6777 13.9178 15.8258 14.0019 15.9863 14.0532C16.1676 14.1111 16.3709 14.1111 16.7741 14.1111H23.0002M15.6664 1.88892H22.9998" stroke="#4AA4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      }
                      @case ('income') {
                        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.999832 1.88892H7.22593C7.62968 1.88892 7.83071 1.88892 8.0121 1.94684C8.17263 1.99811 8.32118 2.082 8.44772 2.19328C8.59072 2.31902 8.69475 2.49219 8.90247 2.8384L11.9995 8.00007L15.0965 13.1617C15.3042 13.5079 15.4082 13.6808 15.5512 13.8066C15.6777 13.9178 15.8258 14.0019 15.9863 14.0532C16.1676 14.1111 16.3709 14.1111 16.7741 14.1111H23.0002M15.6664 1.88892H22.9998" stroke="#4AA4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      }
                      @case ('outcome') {
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.0005 17L14.1543 11.0625C14.0493 10.9559 13.9962 10.9024 13.9492 10.8604C13.1899 10.1807 12.0416 10.1807 11.2822 10.8604C11.2352 10.9024 11.1817 10.9558 11.0767 11.0625C10.9716 11.1692 10.9191 11.2226 10.8721 11.2646C10.1127 11.9443 8.96397 11.9443 8.20461 11.2646C8.15759 11.2226 8.10506 11.1692 8 11.0625L4 7M20.0005 17L20 11M20.0005 17H14" stroke="#E2060A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      }
                    }
                  </div>
                  <div class="main-details flex flex-col gap-1 max-w-[163px]">
                    <p class="description text-sm line-clamp-3">{{ transaction.description }}</p>
                    <div class="targets flex gap-[0.625rem] justify-start items-center">
                      @switch (transaction.type) {
                      @case ('g2g') {
                        <p class="origin text-xs text-(color:--secondary)/60"> {{ transaction.origin.name }} </p>
                        <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 0.5L4 3.5L1 6.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p class="destination text-xs text-(color:--secondary)/60"> {{ transaction.destination.name }} </p>
                      }
                      @case ('income') {
                        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.999832 1.88892H7.22593C7.62968 1.88892 7.83071 1.88892 8.0121 1.94684C8.17263 1.99811 8.32118 2.082 8.44772 2.19328C8.59072 2.31902 8.69475 2.49219 8.90247 2.8384L11.9995 8.00007L15.0965 13.1617C15.3042 13.5079 15.4082 13.6808 15.5512 13.8066C15.6777 13.9178 15.8258 14.0019 15.9863 14.0532C16.1676 14.1111 16.3709 14.1111 16.7741 14.1111H23.0002M15.6664 1.88892H22.9998" stroke="#4AA4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                  <div class="secondary-details flex flex-col justify-auto">
                    <p class="currency">  </p>
                  </div>
                </div>
              }
            </div>
          </ng-container>
        </app-card>
      </section>

    </div>
  `,
  styles: ``
})
export class DashboardPage {
  activeAccount = signal<number>(0);
  accounts = signal([
    {
      id: 'uuid',
      name: 'Banco Bai',
      type: {
        id: 'tid',
        description: 'Conta corrente',
        icon: {
          id: 6,
          reference: 'dolar',
          display: 'dolar',
          embedded_svg: '<svg></svg>'
        }
      },
      amount: 345343459.91,
      settings: {
        color: '#002D74',
        currency: {
          name: 'Angolan Kwanza',
          code: 'AOA'
        }
      }
    },
    {
      id: 'uuid2',
      name: 'Banco Atlântico',
      type: {
        id: 'tid',
        description: 'Conta corrente',
        icon: {
          id: 6,
          reference: 'dolar',
          display: 'dolar',
          embedded_svg: '<svg></svg>'
        }
      },
      amount: 545343459.91,
      settings: {
        color: '#1892AE',
        currency: {
          name: 'Angolan Kwanza',
          code: 'AOA'
        }
      }
    },
    {
      id: 'uuid3',
      name: 'Banco Bfa',
      type: {
        id: 'tid',
        description: 'Conta poupança',
        icon: {
          id: 6,
          reference: 'pig',
          display: 'pig',
          embedded_svg: '<svg></svg>'
        }
      },
      amount: 545343459.91,
      settings: {
        color: '#FC8C24',
        currency: {
          name: 'Angolan Kwanza',
          code: 'AOA'
        }
      },
    },
  ]);

  goals = signal([
    {
      id: 'gid',
      name: 'Comprar Chinelo',
      description: 'description',
      amount: 3245323.65,
      achievement: 5000000.00,
      excess_amount: 0,
      progress: 60,
      icon: {
        id: 10,
        reference: 'car',
        display: 'car',
        embedded_svg: `
        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4.3L3.26822 6.11456C3.41798 6.2344 3.60676 6.3 3.80171 6.3H13.1982C13.3932 6.3 13.582 6.2344 13.7317 6.11456L16 4.3M3.91667 9.1H3.925M13.0833 9.1H13.0917M5.30054 1.5H11.6995C12.2976 1.5 12.8498 1.80766 13.1465 2.30618L15.5608 6.36216C15.8486 6.84568 16 7.39288 16 7.94984V12.7C16 13.1418 15.6269 13.5 15.1667 13.5H14.3333C13.8731 13.5 13.5 13.1418 13.5 12.7V11.9H3.5V12.7C3.5 13.1418 3.1269 13.5 2.66667 13.5H1.83333C1.3731 13.5 1 13.1418 1 12.7V7.94984C1 7.39288 1.15138 6.84568 1.43919 6.36216L3.85347 2.30618C4.1502 1.80766 4.70244 1.5 5.30054 1.5ZM4.33333 9.1C4.33333 9.32088 4.14678 9.5 3.91667 9.5C3.68655 9.5 3.5 9.32088 3.5 9.1C3.5 8.87912 3.68655 8.7 3.91667 8.7C4.14678 8.7 4.33333 8.87912 4.33333 9.1ZM13.5 9.1C13.5 9.32088 13.3134 9.5 13.0833 9.5C12.8532 9.5 12.6667 9.32088 12.6667 9.1C12.6667 8.87912 12.8532 8.7 13.0833 8.7C13.3134 8.7 13.5 8.87912 13.5 9.1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      account: {
        id: 'uuid',
        name: 'Banco Atlântico',
        settings: {
          color: '#1892AE',
          currency: {
            name: 'Angolan Kwanza',
            code: 'AOA'
          }
        }
      },
      latest_transaction: [
        {
          id: 'trid',
          type: 'income',
          description: 'description',
          notes: 'one note',
          amount: 400000.00,
          from: 'outside',
          date: '2025-09-10',
          origin: null,
          destination: 'trid',
        }
      ]
    },
    {
      id: 'gid',
      name: 'Comprar Prado',
      description: 'description',
      amount: 3245323.65,
      achievement: 50000000.00,
      excess_amount: 0,
      progress: 60,
      icon: {
        id: 10,
        reference: 'car',
        display: 'car',
        embedded_svg: `
        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4.3L3.26822 6.11456C3.41798 6.2344 3.60676 6.3 3.80171 6.3H13.1982C13.3932 6.3 13.582 6.2344 13.7317 6.11456L16 4.3M3.91667 9.1H3.925M13.0833 9.1H13.0917M5.30054 1.5H11.6995C12.2976 1.5 12.8498 1.80766 13.1465 2.30618L15.5608 6.36216C15.8486 6.84568 16 7.39288 16 7.94984V12.7C16 13.1418 15.6269 13.5 15.1667 13.5H14.3333C13.8731 13.5 13.5 13.1418 13.5 12.7V11.9H3.5V12.7C3.5 13.1418 3.1269 13.5 2.66667 13.5H1.83333C1.3731 13.5 1 13.1418 1 12.7V7.94984C1 7.39288 1.15138 6.84568 1.43919 6.36216L3.85347 2.30618C4.1502 1.80766 4.70244 1.5 5.30054 1.5ZM4.33333 9.1C4.33333 9.32088 4.14678 9.5 3.91667 9.5C3.68655 9.5 3.5 9.32088 3.5 9.1C3.5 8.87912 3.68655 8.7 3.91667 8.7C4.14678 8.7 4.33333 8.87912 4.33333 9.1ZM13.5 9.1C13.5 9.32088 13.3134 9.5 13.0833 9.5C12.8532 9.5 12.6667 9.32088 12.6667 9.1C12.6667 8.87912 12.8532 8.7 13.0833 8.7C13.3134 8.7 13.5 8.87912 13.5 9.1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      account: {
        id: 'uuid',
        name: 'Banco Atlântico',
        settings: {
          color: '#1892AE',
          currency: {
            name: 'Angolan Kwanza',
            code: 'AOA'
          }
        }
      },
      latest_transaction: [
        {
          id: 'trid',
          type: 'income',
          description: 'description',
          notes: 'one note',
          amount: 3000000.00,
          from: 'outside',
          date: '2025-09-10',
          origin: null,
          destination: 'trid',
        }
      ]
    },
    {
      id: 'gid',
      name: 'Comprar carro BFA',
      description: 'description',
      amount: 3245323.65,
      achievement: 5000000.00,
      excess_amount: 0,
      progress: 60,
      icon: {
        id: 10,
        reference: 'car',
        display: 'car',
        embedded_svg: `
        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4.3L3.26822 6.11456C3.41798 6.2344 3.60676 6.3 3.80171 6.3H13.1982C13.3932 6.3 13.582 6.2344 13.7317 6.11456L16 4.3M3.91667 9.1H3.925M13.0833 9.1H13.0917M5.30054 1.5H11.6995C12.2976 1.5 12.8498 1.80766 13.1465 2.30618L15.5608 6.36216C15.8486 6.84568 16 7.39288 16 7.94984V12.7C16 13.1418 15.6269 13.5 15.1667 13.5H14.3333C13.8731 13.5 13.5 13.1418 13.5 12.7V11.9H3.5V12.7C3.5 13.1418 3.1269 13.5 2.66667 13.5H1.83333C1.3731 13.5 1 13.1418 1 12.7V7.94984C1 7.39288 1.15138 6.84568 1.43919 6.36216L3.85347 2.30618C4.1502 1.80766 4.70244 1.5 5.30054 1.5ZM4.33333 9.1C4.33333 9.32088 4.14678 9.5 3.91667 9.5C3.68655 9.5 3.5 9.32088 3.5 9.1C3.5 8.87912 3.68655 8.7 3.91667 8.7C4.14678 8.7 4.33333 8.87912 4.33333 9.1ZM13.5 9.1C13.5 9.32088 13.3134 9.5 13.0833 9.5C12.8532 9.5 12.6667 9.32088 12.6667 9.1C12.6667 8.87912 12.8532 8.7 13.0833 8.7C13.3134 8.7 13.5 8.87912 13.5 9.1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      account: {
        id: 'uuid',
        name: 'Banco Bfa',
        settings: {
          color: '#FC8C24',
          currency: {
            name: 'Angolan Kwanza',
            code: 'AOA'
          }
        }
      },
      latest_transaction: [
        {
          id: 'trid',
          type: 'income',
          description: 'description',
          notes: 'one note',
          amount: 400000.00,
          from: 'outside',
          date: '2025-09-10',
          origin: null,
          destination: 'trid',
        }
      ]
    }
  ]);

  latest_transactions = signal([
    {
      type: 'g2g',
      amount: 3245323.00,
      from: 'inside',
      transaction_date: '2025-06-26',
      origin: {
        id: 'origin goal',
        name: 'Viagem',
        account: {
          id: 'uuid',
          name: 'Banco Bfa',
          settings: {
            color: '#FC8C24',
            currency: {
              name: 'Angolan Kwanza',
              code: 'AOA'
            }
          }
        },
      },
      destination: {
        id: 'destination goal',
        name: 'Comprar carro',
        account: {
          id: 'uuid',
          name: 'Banco Bfa',
          settings: {
            color: '#FC8C24',
            currency: {
              name: 'Angolan Kwanza',
              code: 'AOA'
            }
          }
        },
      },
      description: 'Troca para auxiliar no carro',
      note: 'note'
    }
  ]);
}
