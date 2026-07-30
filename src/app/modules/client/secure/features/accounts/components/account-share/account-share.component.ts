import { Component, computed, DestroyRef, effect, inject, input, output, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { AccountAccess } from '@core/models/base-account.model';
import { take, finalize } from 'rxjs';
import { PopupService } from '@core/services/pop-up.service';
import { AccountShareFacade } from '../../share.facade';
import { Darkable } from "@shared/directives/darkable";
import { GetInitialsPipe } from '@shared/pipes/get-initials-pipe';
import { FinanceStore } from '@core/data/finance-store.data';
import { User } from '@core/models/user.model';
import { InfoDialogUi } from "@shared/ui/dialogs/info-dialog.ui";
import { DrawerComponent } from "@shared/components/drawer.component";
import { SearchUserComponent } from "./search-user/search-user.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountShareFormComponent } from "./account-share-form/account-share-form.component";

@Component({
  selector: 'app-account-share',
  imports: [Darkable, GetInitialsPipe, InfoDialogUi, DrawerComponent, SearchUserComponent, AccountShareFormComponent],
  template: `
    <div class="account-share-container flex flex-col gap-6 mb-6">
      <h3 class="text-base font-medium text-(--secondary)" appDarkable="dark:text-(color:--dm-secondary)">A partilhar com</h3>

      <div class="users-container overflow-x-auto">
        <div class="scroller w-fit flex justify-start items-stretch relative">
          <button (click)="addUser()" class="sticky-btn sticky z-2 left-0 top-0 px-2 bg-[#F2F4F5] flex flex-col gap-2 text-(--primary) darkmode-enabled dark:bg-[#414141] dm-bg-color-transition">
            <div class="icon">
              <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="63" height="63" rx="31.5" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-dasharray="4 4"/>
                <mask id="mask0_217_429" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="14" y="14" width="37" height="37">
                <rect x="14.5" y="14.5" width="36" height="36" fill="currentColor"/>
                </mask>
                <g mask="url(#mask0_217_429)">
                <path d="M32.5 43C32.075 43 31.7188 42.8563 31.4313 42.5688C31.1438 42.2813 31 41.925 31 41.5V34H23.5C23.075 34 22.7188 33.8563 22.4313 33.5688C22.1438 33.2813 22 32.925 22 32.5C22 32.075 22.1438 31.7188 22.4313 31.4313C22.7188 31.1438 23.075 31 23.5 31H31V23.5C31 23.075 31.1438 22.7188 31.4313 22.4313C31.7188 22.1438 32.075 22 32.5 22C32.925 22 33.2813 22.1438 33.5688 22.4313C33.8563 22.7188 34 23.075 34 23.5V31H41.5C41.925 31 42.2813 31.1438 42.5688 31.4313C42.8563 31.7188 43 32.075 43 32.5C43 32.925 42.8563 33.2813 42.5688 33.5688C42.2813 33.8563 41.925 34 41.5 34H34V41.5C34 41.925 33.8563 42.2813 33.5688 42.5688C33.2813 42.8563 32.925 43 32.5 43Z" fill="currentColor"/>
                </g>
              </svg>
            </div>
            <div class="label">
              <p class="text-center font-medium text-sm">Novo</p>
            </div>
          </button>

          @if(!isLoadingShareInformations()){
            @for (share of accountAccess(); track $index) {
              <div class="px-2 bg-inherit z-1 relative flex flex-col gap-2 text-(--secondary) max-w-20">
                <button (click)="confirmRemoval(share.user)" [disabled]="isRemovingUser()" class="remove-button p-[2.5px] absolute disabled:opacity-50 duration-75 rounded-full bg-white right-0 top-0 flex justify-center items-center overflow-hidden">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.98893 0C12.4076 0 16 3.59245 16 8.01107C16 12.4297 12.4076 16 7.98893 16C3.57031 16 0 12.4297 0 8.01107C0 3.59245 3.57031 0 7.98893 0ZM8.0332 9.17142L10.5774 11.7378C10.8902 12.0505 11.4029 12.0505 11.7156 11.7378C12.0055 11.4479 12.0055 10.9344 11.7156 10.6217L9.17142 8.05534L11.7156 5.489C12.0055 5.17624 12.0055 4.66354 11.7156 4.37292C11.4029 4.06016 10.8902 4.06016 10.5774 4.37292L8.0332 6.93926L5.489 4.37292C5.17624 4.06016 4.66354 4.06016 4.35078 4.37292C4.06087 4.66283 4.06087 5.17624 4.35078 5.489L6.89499 8.05534L4.35078 10.6217C4.06087 10.9344 4.06087 11.4471 4.35078 11.7378C4.66354 12.0505 5.17624 12.0505 5.489 11.7378L8.0332 9.17142Z" fill="#FF4545"/>
                  </svg>
                </button>
                <div class="icon w-[65px] h-[65px] rounded-full overflow-hidden bg-(--primary) text-(--secondary) text-2xl font-bold bg-cover bg-no-repeat text-center flex justify-center items-center"
                [style.backgroundImage]="(share.user.avatar) ? 'url('+ share.user.avatar +')' : ''"
                [class]="share.user.avatar ? 'text-transparent!' : ''"
                >
                  {{ share.user.name | getInitials }}
                </div>
                <div class="label">
                  <p class="text-center font-medium text-sm line-clamp-1" appDarkable="dark:text-(color:--dm-secondary)">{{ share.user.name }}</p>
                </div>
              </div>
            } @empty {
              
            }
          } @else {
            <!-- <app-spinner></app-spinner> -->
          }
        </div>
      </div>

    </div>

    <!-- dialog -->
    <app-info-dialog
    [(openDialog)]="openSuggestionDialog"
    [h4]="'A função de partilha não está habilitada para esta conta. Clique em continuar para abrir as definições da conta.'"
    [onConfirmFnInp]="emitOpenAccountSettingsDrawer"></app-info-dialog>

    <!-- drawer -->
    <q-drawer [(visible)]="openAddUserDrawer">
      <ng-template #panel>
        @if(newShareSection() === 'search-user') {
          <app-search-user (userFoundEmitter)="searchedUserHandler($event)"></app-search-user>
        } @else {
          <app-account-share-form [accountId]="accountId()" [user]="searchedUser()!" (onSuccess)="openAddUserDrawer.set(false)"></app-account-share-form>
        }
      </ng-template>
    </q-drawer>
  `,
  styles: ``
})
export class AccountShareComponent {
  accountId = input.required<string>();

  private facade = inject(AccountShareFacade);
  private financeStore = inject(FinanceStore);

  private destroyRef = inject(DestroyRef);

  isLoadingShareInformations = this.facade.isLoadingShareInformations.asReadonly();
  isRemovingUser = signal<boolean>(false);

  openSuggestionDialog = signal<boolean>(false);
  openAddUserDrawer = signal<boolean>(false);
  openAccountSettingsDrawerEventEmitter = output<boolean>();

  accountSn = computed(() => this.financeStore.accountsMap()[this.accountId()]);

  accountAccess = computed(() => {
    const acc = this.accountSn();
    if (!acc) return [];
    const share = this.financeStore.accountShare()[acc.id];
    return Array.isArray(share) ? share : [];
  });

  searchedUser = signal<User | null>(null);
  newShareSection: Signal<'search-user' | 'user-permissions'> = computed(() => (this.searchedUser() === null) ? 'search-user' : 'user-permissions');

  constructor() {
    effect(() => {
      const id = this.accountId();
      if(id) {
        untracked(() => {
          this.loadData(id)
        })
      }
    });

    effect(() => {
      if (!this.openAddUserDrawer()) {
        untracked(() => {
          this.searchedUser.set(null);
        });
      }
    });
  }

  loadData(id: string): void {
    const accountAccess = this.financeStore.accountShare()[id];
    if(accountAccess !== undefined) return;

    this.facade.isLoadingShareInformations.set(true);
    this.facade.accountAccess(id).pipe(take(1), finalize(() => this.facade.isLoadingShareInformations.set(false))).subscribe({
      next: (data) => {},
      error: (error) => {
        console.error(error)
      }
    });

  }

  addUser(): void {
    if(!this.accountSn()?.share_account){
      this.openSuggestionDialog.set(true);
      return;
    }

    this.openAddUserDrawerFn();

  }

  searchedUserHandler(user: User): void {
    this.searchedUser.set(user);
  }

  emitOpenAccountSettingsDrawer = (): void => {
    this.openSuggestionDialog.set(false);
    this.openAccountSettingsDrawerEventEmitter.emit(true);
  }

  openAddUserDrawerFn = (): void => {
    this.openAddUserDrawer.set(true);
  }

  confirmRemoval(user: User): void {
    if(this.isRemovingUser()) return;

    PopupService.confirm(
      `Deseja realmente parar de partilhar esta conta com o ${user.name ?? user.username}?`,
      () => this.removeUser(user.id)
    )
  }

  removeUser(id: string): void {
    this.isRemovingUser.set(true);
    this.facade.removeUser(id, this.accountId()).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isRemovingUser.set(false))).subscribe({
      next: () => {
        PopupService.success("Utilizador removido da partilha com sucesso.");
      },
      error: () => {
        PopupService.error("Erro ao remover utilizador da partilha.");
      }
    })
  }
}

