import { Component } from '@angular/core';
import { Darkable } from '@shared/directives/darkable';

@Component({
  selector: 'no-data-message',
  imports: [Darkable],
  template: `
  <ng-content select="[message]">
    <div class="empty w-full flex flex-col gap-2 justify-center items-center py-6 text-center">
      <div class="text-(--secondary)/40" appDarkable="dark:text-(--dm-secondary)/40">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>
      <p class="text-(--secondary)/60 text-sm font-medium" appDarkable="dark:text-(--dm-secondary)/60">Nenhum registo disponível</p>
    </div>
  </ng-content>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `
})
export class NoDataMessageUi {

}
