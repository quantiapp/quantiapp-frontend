import { Component, input, OnInit, output } from '@angular/core';
import { BaseGoalViewModel } from '@core/models/base-goal.model';
import { ScrollerComponent } from '../scroller.component';
import { Darkable } from '@shared/directives/darkable';
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { TransactionPrefixPipe } from '@shared/pipes/transaction-prefix-pipe';
import { TransactionExchangePipe } from '@shared/pipes/transaction-exchange-pipe';
import { TransactionColorPipe } from '@shared/pipes/transaction-color-pipe';
import { CardTemplate } from '@client/secure/ui/card.template';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency-pipe';
import { NgxMaskPipe } from 'ngx-mask';
import { DrawerComponent } from "../drawer.component";
import { CreateGoalComponent } from "@client/secure/features/goals/components/create-goal/create-goal.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-goals-container',
  imports: [ScrollerComponent, CardTemplate, Darkable, TransactionColorPipe, TransactionExchangePipe, TransactionPrefixPipe, IconContainerContainer, CustomCurrencyPipe, NgxMaskPipe, DrawerComponent, CreateGoalComponent, RouterLink],
  template: `
    <div class="section-header w-full flex justify-between items-center mb-5">
      <h3 class="text-base text-(color:--secondary) font-medium" appDarkable="dark:text-(color:--dm-secondary)">
        <ng-content select="[title]">Suas metas</ng-content>
      </h3>
      <q-drawer>
        <ng-template #invoker let-open="open">
          <button
          (click)="open()" class="text-(color:--secondary) flex gap-1 justify-center items-center text-sm font-medium"
          appDarkable="dark:text-(color:--dm-secondary)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Nova meta
          </button>
        </ng-template>
        <ng-template #panel let-close="close">
          <app-create-goal (onSuccess)="close()"></app-create-goal>
        </ng-template>
      </q-drawer>
    </div>
    <div class="section-content">
      <q-scroller [isLoading]="isLoading()" [cardType]="'goal'" [itemsArray]="goals()" (active)="this.updateActiveGoal($event)">
        <ng-template #item let-item>

          @let current_amount = item.current_amount;
          @let target_amount = item.target_amount;

          @let diff = target_amount - current_amount;
          @let concluded = item.track_progress && diff <= 0;

          @let concludedBg = '#FFF8E1';
          @let concludedTailwindBg = concluded ? 'bg-[#FFF8E1]!' : 'bg-white';
          @let highlightColor = '#FA9125';

          <app-card [tailwindClassesArray]="['!w-[17.5rem]', concludedTailwindBg]">
            <ng-container header>
              <div class="header-content flex justify-between items-center">
                <div class="card-name">
                  <p class="text-sm font-medium capitalize" [appDarkable]="!concluded ? 'dark:text-(color:--dm-secondary)' : 'not-empty'">
                    {{ item.name }}
                  </p>
                </div>
                <div class="icon text-white">
                  <app-icon-container [key]="item.icon_key" [bgColor]="!concluded ? item.account.color : highlightColor"></app-icon-container>
                </div>
              </div>
            </ng-container>
            <ng-container content>
              <div class="card-content flex flex-col gap-2">
                <div class="details flex justify-between items-center">
                  <p class="text-xs font-medium uppercase duration-[.3s]"
                  [style.color]="!concluded ? item.account.color : highlightColor">
                    {{ item.account.currency.code }}
                  </p>
                  @if(item.last_transaction){
                    <p class="text-xs text-(color:--secondary)/60 capitalize" [appDarkable]="!concluded ? 'dark:text-(color:--dm-secondary)/70' : 'not-empty'">
                      Último movimento:
                      <span [style.color]="item.last_transaction | transactionColor ">
                        @if(item.account.can_see_balance) {
                          {{ item.last_transaction | transactionPrefix }}{{ item.last_transaction | transactionExchange | money }}
                        } @else {
                          ******,00
                        }
                      </span>
                    </p>
                  } @else {
                    <p class="text-xs text-(color:--secondary)/60" [appDarkable]="!concluded ? 'dark:text-(color:--dm-secondary)/70' : ''">
                      Sem transações registradas
                    </p>
                  }
                </div>
                <div class="progress">
                  <div class="numbers flex justify-between items-end">
                    <div class="percentage">
                      <p
                      class="text-xl font-bold text-[#202020]/20"
                      >
                      <!-- [style.color]="!concluded ? item.account.color : highlightColor"
                      [appDarkable]="!concluded ? 'dark:text-(color:--dm-secondary)' : 'not-empty'" -->
                        <span class=" duration-[.3s]"[style.color]="!concluded ? item.account.color : highlightColor">
                          {{ item.progress | mask: 'percent' : { suffix: '%' } }}
                        </span>
                      </p>
                    </div>
                    <div class="achievements text-xs font-medium">
                      @if(!concluded) {
                        <p
                        class=" text-[#202020]/60 duration-[.3s]"
                        [appDarkable]="!concluded ? 'dark:text-(color:--dm-secondary)' : 'not-empty'"
                        >
                          <span class="" [style.color]="item.account.color">
                            {{ (item.account.can_see_balance) ? (item.current_amount | money) : '*********,00' }}
                          </span>
                          / {{ item.target_amount | money }}
                        </p>
                      } @else {
                        <p class="" [style.color]="highlightColor">
                          <span>🏅</span>
                          Meta alcançada
                        </p>
                      }
                    </div>
                  </div>
                  <div class="progress-track mt-2">
                    <div class="thumb bg-[#F2F2F2] rounded-full w-full h-2 overflow-hidden">
                      <div class="tracker h-full duration-[.3s]" [style.max-width.%]="item.progress" [style.background-color]="!concluded ? item.account.color : highlightColor"></div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>
            <ng-container foot>
              <div class="ctas flex gap-[0.625rem] flex-wrap justify-start items-center">
                <a href="" class="text-sm flex gap-1 justify-center items-center text-white rounded-full px-2 py-2 duration-[.3s]" [style.background-color]="!concluded ? item.account.color : highlightColor">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 12.0001H12.5M12.5 12.0001H16.5M12.5 12.0001V16.0001M12.5 12.0001V8.0001M12.5 21.0001C7.52944 21.0001 3.5 16.9707 3.5 12.0001C3.5 7.02954 7.52944 3.0001 12.5 3.0001C17.4706 3.0001 21.5 7.02954 21.5 12.0001C21.5 16.9707 17.4706 21.0001 12.5 21.0001Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Adicionar
                </a>
                <a [routerLink]="['/secure/' + item.account.id + '/goals/show/', item.id]" class="text-sm flex gap-1 justify-center items-center bg-white text-(color:--secondary) border border-(color:--secondary)/10 rounded-full px-2 py-2"
                [style.backgroundColor]="!concluded ? 'white' : concludedBg"
                >
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
export class GoalsContainer implements OnInit {
  isLoading = input.required<boolean>();
  goals = input.required<BaseGoalViewModel[]>();

  activeGoalEmitter = output<number>();

  updateActiveGoal(index: number): void {
    this.activeGoalEmitter.emit(index);
  }

  ngOnInit(): void {
    console.log(this.goals())
  }
}
