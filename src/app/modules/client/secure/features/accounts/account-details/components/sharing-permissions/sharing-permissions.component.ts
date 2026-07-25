import { Component, computed, DestroyRef, inject, linkedSignal, signal } from '@angular/core';
import { Darkable } from "@shared/directives/darkable";
import { CardTemplate } from "@client/secure/ui/card.template";
import { FinanceStore } from '@core/data/finance-store.data';
import { DetailsFacade } from '../../details.facade';
import { AccountShareFacade } from '../../../share.facade';
import { SpinnerUi } from "@shared/ui/spinner/spinner.ui";
import { ToggleComponent } from "@shared/components/forms/toggle.component";
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { SubmitableButton } from "@shared/directives/submitable-button";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-sharing-permissions',
  imports: [Darkable, CardTemplate, SpinnerUi, ToggleComponent, FormsModule, SubmitableButton, Darkable],
  template: `
    <app-card>
      <ng-container header>
        <div class="section-header flex justify-between items-center">
          <h3 class="text-base text-(color:--secondary) font-bold" appDarkable="dark:text-(color:--dm-secondary)">
            Permissões
          </h3>
        </div>
      </ng-container>
      <ng-container content>
        @if(!isLoadingShareInformations()) {
          @for (share of accountAccess(); track $index) {
            <div class="item not-[:last-child]:pb-4 not-[:last-child]:border-b not-[:last-child]:border-[#F2F2F2] dark:not-[:last-child]:border-[#F2F2F2]/10"
            [class]="!$first ? 'pt-4' : ''"
            >
              <div class="user-container border border-[#F2F2F2] dark:border-[#F2F2F2]/10 rounded-[10px] p-4 flex flex-col gap-3">
                <h3 class="text-sm font-bold uppercase line-clamp-1 text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                  {{ share.user.name }}
                </h3>
                <div class="user-permissions flex flex-col gap-3">
                  <div class="incomes flex justify-between items-center">
                    <span class="text-sm text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                      Registar entradas na conta
                    </span>
                    <div class="toggle">
                      <q-toggle [(ngModel)]="this.sendable()[$index].permissions.income_transaction"></q-toggle>
                    </div>
                  </div>
                  <div class="outcomes flex justify-between items-center">
                    <span class="text-sm text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                      Registar saídas na conta
                    </span>
                    <div class="toggle">
                      <q-toggle [(ngModel)]="this.sendable()[$index].permissions.outcome_transaction"></q-toggle>
                    </div>
                  </div>
                  <div class="incomes flex justify-between items-center">
                    <span class="text-sm text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                      Visualizar a quantia na conta
                    </span>
                    <div class="toggle">
                      <q-toggle [(ngModel)]="this.sendable()[$index].permissions.can_see_amount"></q-toggle>
                    </div>
                  </div>
                </div>
              </div>
              
              @if(hasChanges($index)) {
                <div class="btn flex justify-end items-center mt-2">
                  <button
                  type="submit"
                  [disabled]="this.isUpdatingPermissions()"
                  (click)="saveChanges($index)"
                  appSubmitableButton
                  tailwindClassBackgroundColor="bg-(color:--primary)/63"
                  tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                  class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium disabled:opacity-50">
                    Salvar
                  </button>
                </div>
              }

            </div>
          }
        } @else {
          <div class="div flex justify-center text-(--secondary)/90 dark:text-(--dm-secondary)/90">
            <app-spinner></app-spinner>
          </div>
        }
      </ng-container>
    </app-card>
  `,
  styles: ``
})
export class SharingPermissionsComponent {
  private financeStore = inject(FinanceStore);
  private detailsFacade = inject(DetailsFacade);
  private accountShareFacade = inject(AccountShareFacade);
  private destroyRef = inject(DestroyRef);

  isLoadingShareInformations = this.accountShareFacade.isLoadingShareInformations.asReadonly();
  isUpdatingPermissions = signal<boolean>(false);

  private account = this.detailsFacade.account;

  accountAccess = computed(() => {
    const accountId = this.account()!.account.id;
    return this.financeStore.accountShare()[accountId];
  });

  sendable = linkedSignal({
    source: this.accountAccess,
    computation: (sourceData) => structuredClone(sourceData)
  });

  saveChanges(index: number): void {
    this.isUpdatingPermissions.set(true);
    this.accountShareFacade.updateUserPermissions(this.sendable()[index]).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isUpdatingPermissions.set(false))
    ).subscribe({
      next: () => {
        PopupService.success("Permissões atualizadas com sucesso!");
      },
      error: () => {
        PopupService.error("Erro ao atualizar permissões.");
      }
    });
  }

  hasChanges(index: number): boolean {
    const original = this.accountAccess()[index].permissions;
    const draft = this.sendable()[index].permissions;

    return  original.can_see_amount !== draft.can_see_amount  ||
            original.can_see_goals !== draft.can_see_goals    ||
            original.can_see_transactions !== draft.can_see_transactions ||
            original.income_transaction !== draft.income_transaction ||
            original.outcome_transaction !== draft.outcome_transaction;
  }

  reset(index: number): void {
    this.sendable()[index].permissions = this.accountAccess()[index].permissions;
  }
}

