import { Component, input, signal } from '@angular/core';
import { GoalInfoTab } from '../../../models';
import { CardTemplate } from "@client/secure/ui/card.template";
import { GeneralGoalDetailsComponent } from './tabs/general.component';
import { TheAccount } from '@client/secure/features/accounts/account-details/details.page';
import { TheGoal } from '../../goal-details.page';

@Component({
  selector: 'app-goal-info',
  imports: [CardTemplate, GeneralGoalDetailsComponent],
  template: `
   <app-card>
    <div header>
      <div class="tabs flex gap-3 justify-start items-center">
        <button class="tab py-1.5 px-2.5 rounded-[5px] font-medium duration-300"
        (click)="changeTab('general')"
        [class]="activeTab() === 'general' ? 'bg-(--primary)/60 text-(--secondary)' : 'bg-white text-(--secondary)/60'"
        >
          Geral
        </button>
        <!-- <button class="tab py-1.5 px-2.5 rounded-[5px] font-medium duration-300"
        (click)="changeTab('statistics')"
        [class]="activeTab() === 'statistics' ? 'bg-(--primary)/60 text-(--secondary)' : 'bg-white text-(--secondary)/60'"
        >
          Estatísticas
        </button> -->
      </div>
    </div>
    <div content>
      @switch (activeTab()) {
        @case ('statistics') {}
        @default {
          <app-general-goal-details [account]="account()" [goal]="this.goal()!"></app-general-goal-details>
        }
      }
    </div>
   </app-card>
  `,
  styles: ``
})
export class GoalInfoComponent {
  account = input.required<TheAccount>();
  goal = input.required<TheGoal>();
  activeTab = signal<GoalInfoTab>('general');

  changeTab(tab: GoalInfoTab): void {
    this.activeTab.update(value => value = tab);
  }
}
