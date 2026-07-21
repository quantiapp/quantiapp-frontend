import { Component, computed, DestroyRef, effect, inject, signal, untracked, WritableSignal } from '@angular/core';
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

  private _account: WritableSignal<TheAccount | null> = signal(null);
  account = this._account.asReadonly();

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
        this.findAccount(id);
      }
    })
  }

  findAccount(id: string): void {

    let account: TheAccount | null = null;

    const ownedAccount = this.financeStoreViewModel.ownedAccountsMap()[id];
    const sharedAccount = this.financeStoreViewModel.sharedAccountsMap()[id];

    if(ownedAccount !== undefined) {
      account = {
        type: 'owner',
        account: this.financeStoreViewModel.ownedAccountsMap()[id]
      }
    }

    if(sharedAccount !== undefined) {
      account = {
        type: 'shared',
        account: this.financeStoreViewModel.sharedAccountsMap()[id]
      }
    }

    if(account === null){
      PopupService.error("Não foi possível localizar esta conta.");
      this.routerService.routeToSecureIndex('accounts')
      return;
    }
    
    this._account.set(account);
  }

  openAccountSettingsDrawerFn(state: boolean): void {
    this.openAccountSettingsDrawer.set(state);
  }

}