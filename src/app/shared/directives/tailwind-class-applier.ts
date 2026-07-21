import { Directive, effect, ElementRef, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTailwindClassApplier]'
})
export class TailwindClassApplier {

  tailwindClassesArray = input.required<string[]>();
  constructor(private renderer2: Renderer2, private element: ElementRef<HTMLElement>) {
    effect(() => {
      this.tailwindClassesArray().forEach((tailwindClass: string) => {
        this.renderer2.addClass(this.element.nativeElement, tailwindClass);
      })
    });
  }

}
