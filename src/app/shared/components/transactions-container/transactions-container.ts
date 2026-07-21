import { Component, input } from '@angular/core';
import { NoDataMessageUi } from "@shared/ui/no-data-message/no-data-message.ui";
import { CoinSpinnerUi } from "@shared/ui/coin-spinner/coin-spinner.ui";
import { CardTemplate } from "@client/secure/ui/card.template";
import { RouterLink } from "@angular/router";
import { BaseTransaction } from '@core/models/base-transaction.model';
import { TransactionItemComponent } from './transaction-item.component';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-transactions-container',
  imports: [NoDataMessageUi, CoinSpinnerUi, CardTemplate, RouterLink, TransactionItemComponent, Darkable],
  template: `
    <app-card>
      <ng-container header>
        <div class="section-header flex justify-between items-center">
          <h3 class="text-base text-(color:--secondary) font-bold" appDarkable="dark:text-(color:--dm-secondary)">
            Últimas transações
          </h3>
          <a [routerLink]="['/secure/transactions']" class="text-(color:--secondary) flex gap-1 justify-center items-center text-sm font-medium"
          appDarkable="dark:text-(color:--dm-secondary)"
          >
            Ver todas
          </a>
        </div>
      </ng-container>
      <ng-container content>
        @if(!isLoading()){
          <div class="transactions">
            @for (transaction of transactions(); track transaction.id) {
              <app-transaction-item [transaction]="transaction" [isLastItem]="$last"></app-transaction-item>
            } @empty {
              <no-data-message />
            }
          </div>
        } @else {
          <coin-spinner />
        }
      </ng-container>
    </app-card>
  `,
  styles: ``
})
export class TransactionsContainer {
  isLoading = input.required<boolean>();
  transactions = input.required<BaseTransaction[]>();
}
