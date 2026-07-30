import { Component, inject, input, signal } from '@angular/core';
import { TheAccount } from '@client/secure/features/accounts/account-details/details.page';
import { TheGoal } from '../../../goal-details.page';
import { RouterLink } from "@angular/router";
import { Darkable } from "@shared/directives/darkable";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { BarSpinnerUi } from "@shared/ui/spinner/bar-spinner.ui";
import { GoalFacade } from '@client/secure/features/goals/goal.facade';
import { PopupService } from '@core/services/pop-up.service';
import { finalize } from 'rxjs';
import { RouterService } from '@core/services/router.service';

@Component({
  selector: 'app-general-goal-details',
  imports: [RouterLink, Darkable, SubmitableButton, BarSpinnerUi],
  template: `
    <div class="general-container flex flex-col gap-4">
      <div class="account flex flex-col gap-3">
        <h3 class="text-(color:--secondary)" appDarkable="dark:text-(--dm-secondary)">Conta</h3>
        <a [routerLink]="['/secure/accounts/show', account().account.id, 'finance']" class="flex items-center gap-2 text-sm text-(color:--primary)">
          {{ account().account.name }}
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_420_1176)">
            <path d="M6.60961 1.43956C7.53135 0.517826 8.78149 0 10.0851 0C12.7995 0 15 2.20051 15 4.91498C15 6.21851 14.4822 7.46865 13.5605 8.39039L11.6383 10.3125L10.3125 8.98668L12.2347 7.06456C12.8047 6.49446 13.125 5.72123 13.125 4.91498C13.125 3.23604 11.7639 1.875 10.0851 1.875C9.27877 1.875 8.50554 2.19528 7.93544 2.76539L6.01332 4.6875L4.6875 3.36168L6.60961 1.43956Z" fill="#F1C40F"/>
            <path d="M7.06456 12.2347L8.98668 10.3125L10.3125 11.6383L8.39039 13.5605C7.46865 14.4822 6.21851 15 4.91498 15C2.20051 15 0 12.7995 0 10.0851C0 8.7815 0.517825 7.53135 1.43956 6.60961L3.36168 4.6875L4.6875 6.01332L2.76539 7.93544C2.19528 8.50554 1.875 9.27877 1.875 10.0851C1.875 11.7639 3.23604 13.125 4.91498 13.125C5.72123 13.125 6.49446 12.8047 7.06456 12.2347Z" fill="#F1C40F"/>
            <path d="M5.35043 10.9755L10.9754 5.35049L9.64961 4.02466L4.0246 9.64967L5.35043 10.9755Z" fill="#F1C40F"/>
            </g>
            <defs>
            <clipPath id="clip0_420_1176">
            <rect width="15" height="15" fill="white"/>
            </clipPath>
            </defs>
          </svg>
        </a>
      </div>
      <div class="goal-description flex flex-col gap-3">
        <h3 class="text-(color:--secondary)" appDarkable="dark:text-(--dm-secondary)">Descrição</h3>
        <p class="text-sm text-(color:--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">
          {{ goal().goal.description }}
        </p>
      </div>
      <div class="delete-goal flex flex-col gap-3">
        <h3 class="text-(color:--secondary) py-2" appDarkable="dark:text-(--dm-secondary)">Eliminar meta</h3>
        <button
          type="submit"
          (click)="delete()"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-[#FF252A]/60"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(255,37,42,25%)]"
          class="w-full text-sm border border-[#B6070B]/40 rounded-[0.563rem] px-2.5 text-center py-1.5 font-medium text-(--secondary)"
          appDarkable="dark:text-(--dm-secondary)"
          [disabled]="isDeletingGoal()">
            @if(isDeletingGoal()) {
              <app-bar-spinner></app-bar-spinner>
            } @else {
              Eliminar meta
            }
        </button>
      </div>
    </div>
  `,
  styles: ``
})
export class GeneralGoalDetailsComponent {
  account = input.required<TheAccount>();
  goal = input.required<TheGoal>();
  isDeletingGoal = signal<boolean>(false);
  private goalFacade = inject(GoalFacade);
  private router = inject(RouterService);

  delete(): void {
    if(this.isDeletingGoal()) return;

    PopupService.confirm(
      "Ao remover esta meta irá remover também todos os seus dados. Deseja continuar mesmo assim?",
      () => this.onConfirm()
    );
  }

  private onConfirm(): void {
    this.isDeletingGoal.set(true);
    this.goalFacade.delete(this.goal().goal.id).pipe(finalize(() => this.isDeletingGoal.set(false))).subscribe({
      next: response => {
        PopupService.success("Meta: " + this.goal().goal.name + " removida com êxito.");
        this.router.routeTo(['/secure/accounts']);
      },
      error: error => {}
    })
  }
}
