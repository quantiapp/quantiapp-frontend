import { Directive, ElementRef, inject, input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMotionedHeight]'
})
export class MotionedHeight implements OnDestroy {

  private mutationObserver: MutationObserver;
  RouterOutletable = input.required<boolean>();

  private renderer2 = inject(Renderer2);
  private callsCount = 0;

  constructor(private element: ElementRef<HTMLElement>) {
    this.mutationObserver = new MutationObserver((mutations) => {
      const children = this.element.nativeElement.childNodes as NodeListOf<HTMLElement>;
      
      let totalHeight: number = 0;
      children.forEach(child => {
        totalHeight += child.clientHeight ?? 0
      });
      
      this.renderer2.setStyle(this.element.nativeElement, 'height', `${ totalHeight }px`);
      this.callsCount++;
      
      console.log(this.element.nativeElement.className ,mutations, this.callsCount)
      if(this.RouterOutletable() && this.callsCount <= 2) return;
      this.renderer2.addClass(this.element.nativeElement, 'duration-[1s]');

    });

    this.mutationObserver.observe(this.element.nativeElement, {
      childList: true,
    });
  }

  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
    this.callsCount = 0;
  }

}
