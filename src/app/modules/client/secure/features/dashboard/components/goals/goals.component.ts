import { Component, input, output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ScrollerComponent } from "@shared/components/scroller.component";
import { CardTemplate } from "@client/secure/ui/card.template";
import { NgxMaskPipe } from 'ngx-mask';
import { HtmlSanitizerPipe } from '@shared/pipes/html-sanitizer-pipe';
import { DashboardAccount, DashboardGoal } from '../../models';
import { Darkable } from '@shared/directives/darkable';
import { TransactionColorPipe } from '@shared/pipes/transaction-color-pipe';
import { TransactionExchangePipe } from '@shared/pipes/transaction-exchange-pipe';
import { TransactionPrefixPipe } from '@shared/pipes/transaction-prefix-pipe';

@Component({
  selector: 'app-dashboard-goals',
  imports: [RouterLink, ScrollerComponent, CardTemplate, NgxMaskPipe, HtmlSanitizerPipe, Darkable, TransactionColorPipe, TransactionExchangePipe, TransactionPrefixPipe],
  template: `
    <div class="section-header w-full flex justify-between items-center mb-5">
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
      <q-scroller [isLoading]="isLoading()" [itemsArray]="goals()" (active)="this.updateActiveGoal($event)">
        <ng-template #item let-item>
          <app-card [tailwindClassesArray]="['!w-[17.5rem]']">
            <ng-container header>
              <div class="header-content flex justify-between items-center">
                <div class="card-name">
                  <p class="text-sm font-medium capitalize" appDarkable="dark:text-(color:--dm-secondary)">
                    {{ item.name }}
                  </p>
                </div>
                <div class="icon p-1 rounded duration-[.3s]" [style.background-color]="item.account.settings.color" [innerHTML]="item.icon.embedded_svg | htmlSanitizer">
                </div>
              </div>
            </ng-container>
            <ng-container content>
              <div class="card-content flex flex-col gap-2">
                <div class="details flex justify-between items-center">
                  <p class="text-xs font-medium uppercase duration-[.3s]"
                  [style.color]="item.account.settings.color">
                    {{ item.account.settings.currency.code }}
                  </p>
                  <p class="text-xs text-(color:--secondary)/60 capitalize" appDarkable="dark:text-(color:--dm-secondary)/70">
                    Último movimento: 
                    @let dependencies = { account: this.dependencies().account, goal: item };

                    <span [style.color]="item.latest_transactions[0] | transactionColor: dependencies ">
                    {{ item.latest_transactions[0] | transactionPrefix: dependencies }}{{ item.latest_transactions[0] | transactionExchange:dependencies | mask: 'separator.2' }}
                    </span>
                  </p>
                </div>
                <div class="progress">
                  <div class="numbers flex justify-between items-end">
                    <div class="percentage">
                      <p
                      class="text-xl font-bold text-[#202020]/20"
                      >
                      <!-- [style.color]="item.account.settings.color"
                      appDarkable="dark:text-(color:--dm-secondary)" -->
                        <span class=" duration-[.3s]" [style.color]="item.account.settings.color">
                          {{ item.progress | mask: 'percent' : { suffix: '%' } }}
                        </span>
                      </p>
                    </div>
                    <div class="achievements text-xs font-medium">
                      <p
                      class=" text-[#202020]/60 duration-[.3s]"
                      appDarkable="dark:text-(color:--dm-secondary)"
                      >
                        <span class="" [style.color]="item.account.settings.color">
                          {{ item.amount | mask: 'separator.2' }}
                        </span>
                        / {{ item.achievement | mask: 'separator.2' }}
                      </p>
                    </div>
                  </div>
                  <div class="progress-track mt-2">
                    <div class="thumb bg-[#F2F2F2] rounded-full w-full h-2 overflow-hidden">
                      <div class="tracker h-full duration-[.3s]" [style.max-width.%]="item.progress" [style.background-color]="item.account.settings.color"></div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>
            <ng-container foot>
              <div class="ctas flex gap-[0.625rem] flex-wrap justify-start items-center">
                <a href="" class="text-sm flex gap-1 justify-center items-center text-white rounded-full px-2 py-2 duration-[.3s]" [style.background-color]="item.account.settings.color">
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
  `,
  styles: ``
})
export class GoalsComponent {
  isLoading = input.required<boolean>();
  dependencies = input.required<{ account: DashboardAccount }>();
  goals = input.required<DashboardGoal[]>();

  activeGoalEmitter = output<number>();

  updateActiveGoal(index: number): void {
    this.activeGoalEmitter.emit(index);
  }
}
