import { Component, input, output } from '@angular/core';
import { DashboardGoalViewModel } from '../../models';
import { GoalsContainer } from "@shared/components/goals-container/goals-container";

@Component({
  selector: 'app-dashboard-goals',
  imports: [GoalsContainer],
  template: `
    <div class="goals">
      <app-goals-container
      (activeGoalEmitter)="updateActiveGoal($event)"
      [isLoading]="isLoading()"
      [activeAccountId]="activeAccountId()"
      [goals]="goals()" />
    </div>
  `,
  styles: ``
})
export class GoalsComponent {
  isLoading = input.required<boolean>();
  goals = input.required<DashboardGoalViewModel[]>();
  activeAccountId = input<string | undefined>();

  activeGoalEmitter = output<number>();

  updateActiveGoal(index: number): void {
    this.activeGoalEmitter.emit(index);
  }
}
