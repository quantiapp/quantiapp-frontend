import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, ElementRef, TemplateRef, viewChild } from '@angular/core';
import { Scroller } from '@core/abstracts/scroller.abstract.class';

@Component({
  selector: 'q-scroller',
  imports: [NgTemplateOutlet],
  template: `
    <div class="scroller-container overflow-hidden relative" #scrollerElementRef>
      <div class="items-container flex w-fit gap-[10px] justify-start items-stretch">
        @for (item of itemsArray(); track $index) {
          <ng-container *ngTemplateOutlet="itemTemplate(); context: { $implicit: item, $index: $index, onClick: clickContext.scrollTo }"></ng-container>
        }
      </div>
    </div>
  `,
  styles: `
    :host *{
      scroll-behavior: smooth;
    }
  `
})
export class ScrollerComponent extends Scroller {
  itemTemplate = contentChild<TemplateRef<any>>('item');
  scrollerContainer = viewChild<ElementRef<HTMLElement>>('scrollerElementRef');
  
  get clickContext(){
    return {
      scrollTo: (index: number) => this.scrollToActiveIndex(index)
    }
  }

  protected override bootstrap(): void {
    this.scrollerElementRef = this.scrollerContainer()!;
  }
}
