import { Directive, ElementRef, input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTailwindClassApplier]'
})
export class TailwindClassApplier implements OnChanges {

  tailwindClassesArray = input.required<string[]>();
  constructor(private renderer2: Renderer2, private element: ElementRef<HTMLElement>) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tailwindClassesArray().forEach((tailwindClass: string) => {
      this.renderer2.addClass(this.element.nativeElement, tailwindClass);
    })
  }

}
