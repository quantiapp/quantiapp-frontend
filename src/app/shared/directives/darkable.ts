import { computed, Directive, ElementRef, input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDarkable]'
})
export class Darkable implements OnInit {

  appDarkable = input.required<string>();
  constructor(private renderer2: Renderer2, private element: ElementRef<HTMLElement>) { }
  
  ngOnInit(): void {
    let transictionType = computed(() => {
      if(this.appDarkable().includes('dark:bg-')){
        return 'dm-bg-color-transition';
      } else if(this.appDarkable().includes('dark:text-')){
        return 'dm-text-color-transition';
      } else {
        return '';
      }
    })

    this.renderer2.addClass(this.element.nativeElement, `darkmode-enabled`);
    this.renderer2.addClass(this.element.nativeElement, `${ this.appDarkable() }`);
    this.renderer2.addClass(this.element.nativeElement, `${ transictionType() }`);
  }

}
