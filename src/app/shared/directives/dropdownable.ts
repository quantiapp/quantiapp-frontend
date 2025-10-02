import { Directive, ElementRef, input, OnChanges, OnInit, Renderer2, SimpleChanges, viewChild } from '@angular/core';
import { totalHeightFromNodeList } from '@core/helpers/total-height.helper';

@Directive({
  selector: '[appDropdownable]'
})
export class Dropdownable implements OnInit, OnChanges {

  appDropdownable = input.required<boolean>();
  constructor(private renderer2: Renderer2, private element: ElementRef<HTMLElement>) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const children = this.element.nativeElement.childNodes as NodeListOf<HTMLElement>;
    
    const totalHeight = totalHeightFromNodeList(children);
    
    this.renderer2.setStyle(this.element.nativeElement, 'height', `${ (this.appDropdownable()) ? totalHeight : 0 }px`);
    this.renderer2.setStyle(this.element.nativeElement, 'margin-bottom', `${ (this.appDropdownable()) ? 30 : 0 }px`);
    this.renderer2.addClass(this.element.nativeElement, 'duration-[.5s]');
  }

}
