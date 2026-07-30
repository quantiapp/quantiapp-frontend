import { Component, input, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HeroUi } from "@shared/ui/hero/hero.ui";
import { TheGoal } from '../../goal-details.page';
import { DialogComponent } from "@shared/components/dialog.component";
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency-pipe';
import { TheAccount } from '@client/secure/features/accounts/account-details/details.page';
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { NgxMaskPipe } from 'ngx-mask';
import { EditGoalComponent } from "../../../components/edit-goal/edit-goal.component";
import { Darkable } from "@shared/directives/darkable";
import { DrawerComponent } from "@shared/components/drawer.component";
import { CreateTransactionComponent } from "@client/secure/features/transactions/components/create-transaction/create-transaction.component";

@Component({
  selector: 'app-goal-hero',
  imports: [RouterLink, HeroUi, DialogComponent, CustomCurrencyPipe, IconContainerContainer, NgxMaskPipe, EditGoalComponent, Darkable, DrawerComponent, CreateTransactionComponent],
  template: `
    <app-hero>
      <div class="goal-details flex gap-2 flex-col items p-4 text-(--secondary)" appDarkable="dark:text-(--secondary)">
        <div class="icon-container flex justify-center text-(color:--primary)">
          <app-icon-container [tailwindClassArray]="['px-2!', 'py-[9px]!', 'rounded-lg!']" [key]="goal().goal.icon_key" [bgColor]="'#202020'" [width]="40" [height]="40"></app-icon-container>
        </div>
        <div class="goal-name w-full flex gap-2.5 flex-wrap justify-center items-center">
          <h1 class="text-2xl font-medium text-center text-(--secondary)" appDarkable="dark:text-(--secondary)">
            {{ goal().goal.name }}
          </h1>
          <q-dialog>
            <ng-template #invoker let-open="open">
              <button (click)="open()" class="badge cursor-pointer bg-white text-(--secondary) text-xs border border-(--primary) rounded-[5px] px-2 py-1 font-medium" appDarkable="dark:text-(--secondary)">
                Editar
              </button>
            </ng-template>
            <ng-template #panel let-closeDialogFn="close">
              <div class="dialog-panel flex flex-col gap-3 p-4 relative">
                <div class="dialog-header sticky top-0 py-4 bg-white z-5" appDarkable="dark:bg-(color:--secondary)">
                  <h1 class="text-base font-medium text-(--secondary) text-left" appDarkable="dark:text-(--dm-secondary)">Editar meta</h1>
                </div>
                
                <app-edit-goal [goal]="goal()" [account]="account()" [closeDialogFn]="closeDialogFn"></app-edit-goal>
              </div>
            </ng-template>
          </q-dialog>

        </div>
        @if(goal().goal.track_progress) {
          <div class="goal-amount-desc mt-2">
            <p class="text-sm text-(--secondary)/60 font-medium text-center" appDarkable="dark:text-(--secondary)/60">
              @let excess_amount = goal().goal.excess_amount;
              @let current_amount = goal().goal.current_amount;
              @let target_amount = goal().goal.target_amount;
              @let diff = target_amount - current_amount;

              @if(excess_amount > 0) {
                O teu saldo apresenta <strong>{{ account().account.can_see_balance ? (excess_amount | money) : '*********' }}</strong> além do esperado
              } @else if(excess_amount < 0) {
                Faltam <strong>{{ account().account.can_see_balance ? (diff | money) : '*********' }}</strong> para atingir a meta
              }

              @if (diff === 0) {
                🏅 Meta alcançada
              }
            </p>
          </div>
        }
        
        @if(!goal().goal.track_progress) {
          <div class="goal-balance w-fit mx-auto mt-0 relative">
            <p class=" text-[2rem] text-(--secondary) font-bold value-text-shadow text-center" appDarkable="dark:text-(--secondary)">
              {{ account().account.can_see_balance ? (goal()!.goal.current_amount | money ) : '**********,00' }}
            </p>
          </div>
        } @else {
          <div class="progress mt-4">
            <div class="numbers flex justify-between items-end">
              <div class="percentage">
                <p
                class="text-2xl font-bold text-[#202020]/20"
                >
                  <span class=" duration-[.3s]" [style.color]="'#202020'">
                    {{ goal().goal.progress | mask: 'percent' : { suffix: '%' } }}
                  </span>
                </p>
              </div>
              <div class="achievements text-sm font-medium">
                <p
                class=" text-[#202020]/60 duration-[.3s]"
                appDarkable="dark:text-(--secondary)/60"
                >
                  <span class="" [style.color]="'#202020'">
                    {{ (goal().goal.account.can_see_balance) ? (goal().goal.current_amount | money) : '*********' }}
                  </span>
                  / {{ account().account.can_see_balance ? (goal().goal.target_amount | money) : '*********' }}
                </p>
              </div>
            </div>
            <div class="progress-track mt-2">
              <div class="thumb bg-[#F2F2F2] rounded-full w-full h-2 overflow-hidden">
                <div class="tracker h-full duration-[.3s]" [style.max-width.%]="goal().goal.progress" [style.background-color]="'#202020'"></div>
              </div>
            </div>
          </div>
        }

      </div>
      
      <div class="goal-actions w-full mt-4 flex gap-6 justify-center items-center">
        
        <div class="add">
          <button (click)="openCreateTransactionDrawer.set(true)" class="text-sm rounded-full px-4 py-2.5 flex gap-1 items-center bg-(--secondary) text-(--primary)"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6667 16H16M16 16H21.3333M16 16V21.3333M16 16V10.6667M16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16C28 22.6274 22.6274 28 16 28Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Adicionar
          </button>
        </div>

      </div>
      
    </app-hero>

    <q-drawer [(visible)]="openCreateTransactionDrawer">
      <ng-template #panel>
        <app-create-transaction [defaultAccountId]="account().account.id" [defaultGoalId]="goal().goal.id" (onSuccess)="openCreateTransactionDrawer.set(false)"></app-create-transaction>
      </ng-template>
    </q-drawer>
  `,
  styles: ``
})
export class GoalHeroComponent {
  goal = input.required<TheGoal>();
  account = input.required<TheAccount>();
  openCreateTransactionDrawer = signal<boolean>(false);
}
