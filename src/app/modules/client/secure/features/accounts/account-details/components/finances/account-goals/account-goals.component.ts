import { Component, input } from '@angular/core';
import { BaseGoal, BaseGoalViewModel } from '@core/models/base-goal.model';
import { GoalsContainer } from "@shared/components/goals-container/goals-container";

@Component({
  selector: 'app-account-goals',
  imports: [GoalsContainer],
  template: `
    <app-goals-container [isLoading]="isLoading()" [goals]="goals()">
      <span title>Metas</span>
    </app-goals-container>
  `,
  styles: ``
})
export class AccountGoalsComponent {
  isLoading = input.required<boolean>();
  goals = input.required<BaseGoalViewModel[]>();
}
