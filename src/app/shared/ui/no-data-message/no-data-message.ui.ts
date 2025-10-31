import { Component } from '@angular/core';

@Component({
  selector: 'no-data-message',
  imports: [],
  template: `
  <ng-content select="[message]">
    <div class="empty w-full flex gap-3 justify-center items-center">
      <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 11.5V18.0625C17 20.2372 13.4183 22 9 22C4.58172 22 1 20.2372 1 18.0625V11.5M17 11.5V4.9375M17 11.5C17 13.6747 13.4183 15.4375 9 15.4375C4.58172 15.4375 1 13.6747 1 11.5M1 11.5V4.9375M17 4.9375C17 2.76288 13.4183 1 9 1C4.58172 1 1 2.76288 1 4.9375M17 4.9375C17 7.11212 13.4183 8.875 9 8.875C4.58172 8.875 1 7.11212 1 4.9375" stroke="#ACACAC" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-[#ACACAC] text-sm">Sem informações disponíveis</p>
    </div>
  </ng-content>
  `,
  styles: ``
})
export class NoDataMessageUi {

}
