import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="flex justify-between items-center">
      <div class="logo w-[3.438rem] h-[3.438rem] rounded-full">
        <a routerLink="/secure/dashboard">
          <img src="/static/primary-brand.svg" class="w-full h-full" alt="Quantiapp logo">
        </a>
      </div>
      <div class="statement max-w-[9.688rem]">
        <ng-content></ng-content>
      </div>
    </header>
  `,
  styles: ``
})
export class HeaderPartial {

}
