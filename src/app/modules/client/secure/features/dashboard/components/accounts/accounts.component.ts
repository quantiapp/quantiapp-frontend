import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardTemplate } from '@client/secure/ui/card.template';
import { ScrollerComponent } from '@shared/components/scroller.component';
import { TailwindClassApplier } from '@shared/directives/tailwind-class-applier';
import { NgxMaskPipe } from 'ngx-mask';
import { DashboardAccount } from '../../models';
import { Darkable } from '@shared/directives/darkable';
import { AccountsContainer } from "@shared/components/accounts-container/accounts-container";

@Component({
  selector: 'app-dashboard-accounts',
  imports: [AccountsContainer],
  template: `
    <div class="section-accounts">
      <app-accounts-container [accounts]="this.accounts()" [isLoading]="this.isLoading()" (activeAccountEmitter)="this.updateActiveAccount($event)"></app-accounts-container>
    </div>
  `,
  styles: ``
})
export class AccountsComponent {
  accounts = input.required<DashboardAccount[]>();
  activeAccountEmitter = output<number>();
  isLoading = input.required<boolean>();

  updateActiveAccount(index: number): void {
    this.activeAccountEmitter.emit(index);
  }
}
