import { isPlatformBrowser } from '@angular/common';
import { Directive, inject, input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appBodyElementOverflower]'
})
export class BodyElementOverflower implements OnInit, OnChanges {

  limitBody = input.required<boolean>();
  element = input<string>('body');

  platformId = inject(PLATFORM_ID);
  
  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.limitBodyElement();
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
