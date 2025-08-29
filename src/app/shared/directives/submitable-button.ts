import { computed, Directive, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSubmitableButton]'
})
export class SubmitableButton implements OnInit {

  /**
   * @required
   * @tailwindClassColor string
   * values example: --primary, #ff3300
   */
  tailwindClassBackgroundColor = input.required<string>();
  tailwindClassShadowColor = input.required<string>();

  private renderer2 = inject(Renderer2);
  constructor(private element: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this.renderer2.addClass(this.element.nativeElement, this.tailwindClassBackgroundColor());
    this.renderer2.addClass(this.element.nativeElement, this.tailwindClassShadowColor());
  }

}
