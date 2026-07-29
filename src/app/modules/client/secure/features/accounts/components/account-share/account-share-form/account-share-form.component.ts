import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '@core/models/user.model';
import { finalize } from 'rxjs';
import { AccountShareFacade } from '../../../share.facade';
import { SpinnerUi } from "@shared/ui/spinner/spinner.ui";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { Darkable } from "@shared/directives/darkable";
import { ControlCharCounterUi } from "@shared/ui/input-char-counter/input-char-counter.ui";
import { ToggleComponent } from "@shared/components/forms/toggle.component";
import { AccountAccess } from '@core/models/base-account.model';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-account-share-form',
  imports: [SpinnerUi, ReactiveFormsModule, SubmitableButton, Darkable, ControlCharCounterUi, ToggleComponent],
  template: `
    <div class="panel-body flex gap-5 flex-col">
      <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Partilha de conta</h1>

      <form (submit)="submit()" [formGroup]="addUserFormGroup" class="panel-form flex gap-5 flex-col">
        <div class="form-control flex flex-col gap-2.5">
          <label for="#user_fullname" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">Utilizador</label>
          <input type="text"
          id="user_fullname"
          class="bg-[#FAFAFA] text-sm border border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
          formControlName="user" readonly placeholder="" >
        </div>

        <div class="permissions-container">
          <div class="item not-[:last-child]:pb-4 not-[:last-child]:border-b not-[:last-child]:border-[#F2F2F2] dark:not-[:last-child]:border-[#F2F2F2]/10">
            <div class="user-container border border-[#F2F2F2] dark:border-[#F2F2F2]/10 rounded-[10px] p-4 flex flex-col gap-3">
              <h3 class="text-sm font-bold line-clamp-1 text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                Permissões
              </h3>
              <div class="user-permissions flex flex-col gap-3">
                <div class="incomes flex justify-between items-center">
                  <span class="text-sm text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                    Registar entradas na conta
                  </span>
                  <div class="toggle">
                    <q-toggle formControlName="incomeTransaction"></q-toggle>
                  </div>
                </div>
                <div class="outcomes flex justify-between items-center">
                  <span class="text-sm text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                    Registar saídas na conta
                  </span>
                  <div class="toggle">
                    <q-toggle formControlName="outcomeTransaction"></q-toggle>
                  </div>
                </div>
                <div class="incomes flex justify-between items-center">
                  <span class="text-sm text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">
                    Visualizar a quantia na conta
                  </span>
                  <div class="toggle">
                    <q-toggle formControlName="canSeeAmount"></q-toggle>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-control">
          @let id = 'notes';
          @let limit = 200;
          <q-control-char-counter [id]="id" [control]="addUserFormGroup.get('notes')!" [limit]="limit" [label]="'Nota'">
            <ng-template #templateInput>
              <textarea
              class="bg-[#FAFAFA] text-sm border w-full resize-none border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
              formControlName="notes" maxlength="{{limit}}" [minlength]="0" [id]="id" rows="5"></textarea>
            </ng-template>
          </q-control-char-counter>
        </div>

        <div class="submit">
          <button
          type="submit"
          [disabled]="this.isSharingWithNewUser() || this.addUserFormGroup.invalid"
          appSubmitableButton
          tailwindClassBackgroundColor="bg-(color:--primary)/63"
          tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
          class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium">
            @if(isSharingWithNewUser()){
              <app-spinner />
            } @else {
              Concluir
            }
          </button>
        </div>

      </form>
    </div>
  `,
  styles: ``
})
export class AccountShareFormComponent implements OnInit {

  user = input.required<User>();
  accountId = input.required<string>();
  onSuccess = output<void>();

  isSharingWithNewUser = signal<boolean>(false);
  addUserFormGroup = new FormGroup<any>({});
  hasSearchedForCurrentKeyValue = signal<boolean>(false);
  private facade = inject(AccountShareFacade);
  private destroyRef = inject(DestroyRef);
  notFoundUser = signal<boolean>(false);
  hasSearched = signal<boolean>(false);

  userFoundEmitter = output<Partial<User>>();

  ngOnInit(): void {
    this.addUserFormGroup = new FormGroup({
      'user': new FormControl(this.user().name, [ Validators.required ]),
      'incomeTransaction': new FormControl(false, [ Validators.required ]),
      'outcomeTransaction': new FormControl(false, [ Validators.required ]),
      'canSeeAmount': new FormControl(true, [ Validators.required ]),
      'notes': new FormControl('', [ Validators.maxLength(200), Validators.minLength(0) ])
    })
  }

  resetHasSearched(): void {
    this.hasSearched.set(false);
  }

  submit(): void {
    if(this.addUserFormGroup.invalid) return;
    this.isSharingWithNewUser.set(true);

    const userAccess: AccountAccess = {
      id: this.accountId(),
      user: this.user(),
      permissions: {
        can_see_goals: true,
        can_see_transactions: true,
        can_see_amount: this.addUserFormGroup.get('canSeeAmount')?.value,
        income_transaction: this.addUserFormGroup.get('incomeTransaction')?.value,
        outcome_transaction: this.addUserFormGroup.get('outcomeTransaction')?.value
      }
    };

    this.facade.addUserAccess(userAccess).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isSharingWithNewUser.set(false);
      })
    ).subscribe({
      next: () => {
        PopupService.success("Conta partilhada com sucesso!");
        this.addUserFormGroup.reset({
          user: this.user().name,
          incomeTransaction: false,
          outcomeTransaction: false,
          canSeeAmount: true,
          notes: ''
        });
        this.onSuccess.emit();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.error?.error || "Erro ao partilhar conta. Tente novamente.";
        PopupService.error(errorMsg);
      }
    });
  }
}
