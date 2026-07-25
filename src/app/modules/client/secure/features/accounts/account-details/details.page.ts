import { Component, computed, DestroyRef, effect, inject, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { AccountHeroComponent } from "./components/account-hero/account-hero.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { BaseAccountViewModel } from '@core/models/base-account.model';
import { PopupService } from '@core/services/pop-up.service';
import { FinanceStoreViewModel } from '@core/view-models/finance-store.viewmodel';
import { AccountShareComponent } from "../components/account-share/account-share.component";
import { RouterService } from '@core/services/router.service';
import { DetailsFacade } from './details.facade';
import { FinanceStore } from '@core/data/finance-store.data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type TheAccount = {
  type: 'owner' | 'shared',
  account: BaseAccountViewModel
}

@Component({
  selector: 'app-details',
  imports: [AccountHeroComponent, AccountShareComponent, RouterOutlet],
  providers: [ DetailsFacade ],
  template: `
    @if (account()) {
      <div class="hero-section">
        <app-account-hero [(openAccountSettingsDrawer)]="openAccountSettingsDrawer" [account]="account()!"></app-account-hero>
      </div>
      <div class="sections-container flex flex-col min-h-screen gap-6 limited-container py-6">
        @if(account()?.type === 'owner') {
          <div class="account-share">
            <app-account-share (openAccountSettingsDrawerEventEmitter)="openAccountSettingsDrawerFn($event)" [accountId]="account()!.account.id"></app-account-share>
          </div>
        }

        <div class="details-section">
          <router-outlet></router-outlet>
        </div>

      </div>
    }
  `,
  styles: ``
})
export class DetailsPage {
  private financeStoreViewModel = inject(FinanceStoreViewModel);
  private financeStore = inject(FinanceStore);

  private routerService = inject(RouterService);
  private activatedRoute = inject(ActivatedRoute);
  private detailsFacade = inject(DetailsFacade);

  openAccountSettingsDrawer = signal<boolean>(false);

  accountId = signal<string | null>(null);

  account: Signal<TheAccount | null> = computed(() => {
    const id = this.accountId();
    if(!id) return null;

    const ownedAccount = this.financeStoreViewModel.ownedAccountsMap()[id];
    if(ownedAccount !== undefined) {
      return {
        type: 'owner',
        account: ownedAccount
      }
    }

    const sharedAccount = this.financeStoreViewModel.sharedAccountsMap()[id];
    if(sharedAccount !== undefined) {
      return {
        type: 'shared',
        account: sharedAccount
      }
    }

    return null;
  });

  constructor(private destroyRef: DestroyRef) {
    effect(() => {
      const currentAccount = this.account();
      if(!currentAccount) return;

      this.detailsFacade.setAccount(currentAccount);
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        const id = params.get('id');
        if(!id){
          this.routerService.routeToSecureIndex('accounts');
          return;
        }
        this.accountId.set(id);

        if(!this.financeStoreViewModel.ownedAccountsMap()[id] && !this.financeStoreViewModel.sharedAccountsMap()[id]){
          PopupService.error("Não foi possível localizar esta conta.");
          this.routerService.routeToSecureIndex('accounts');
        }
      }
    })
  }

  openAccountSettingsDrawerFn(state: boolean): void {
    this.openAccountSettingsDrawer.set(state);
  }

}