import { isPlatformBrowser } from '@angular/common';
import { Directive, effect, inject, input, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appBodyElementOverflower]'
})
export class BodyElementOverflower {

  limitBody = input.required<boolean>();
  element = input<string>('body');

  platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      this.limitBodyElement();
    });
  }

  limitBodyElement(): void{
    if(!isPlatformBrowser(this.platformId)) return;

    const bodyElement = document.querySelector(this.element()) as HTMLElement;
    
    if(this.limitBody()){
      bodyElement.style.height = ` ${bodyElement.clientHeight - 100}px `;
      bodyElement.style.overflow = 'hidden';

    }else{
      bodyElement.style.height = 'auto';
      bodyElement.style.overflow = 'auto';
    }
  }
}
