import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, ElementRef, input, TemplateRef, viewChild } from '@angular/core';
import { Scroller } from '@core/abstracts/scroller.abstract.class';
import { NoDataMessageUi } from "@shared/ui/no-data-message/no-data-message.ui";
import { CoinSpinnerUi } from "@shared/ui/coin-spinner/coin-spinner.ui";

@Component({
  selector: 'q-scroller',
  imports: [NgTemplateOutlet, NoDataMessageUi, CoinSpinnerUi],
  template: `
    <div class="scroller-container overflow-hidden relative" #scrollerElementRef>
      @if(!isLoading()){
        <div class="items-container flex gap-[10px] justify-start items-stretch"
        [style.width]="itemsArray().length > 0 ? 'fit-content' : '100%'"
        >
          @for (item of itemsArray(); track $index) {
            <ng-container *ngTemplateOutlet="itemTemplate(); context: { $implicit: item, $index: $index, onClick: clickContext.scrollTo }"></ng-container>
          } @empty {
            <ng-content select="[onEmpty]">
              <no-data-message />
            </ng-content>
          }
        </div>
      } @else {
        <coin-spinner />
      }
    </div>
  `,
  styles: `
    :host *{
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
    }
  `
})
export class ScrollerComponent extends Scroller {
  itemTemplate = contentChild<TemplateRef<any>>('item');
  scrollerContainer = viewChild<ElementRef<HTMLElement>>('scrollerElementRef');
  isLoading = input.required<boolean>();
  
  get clickContext(){
    return {
      scrollTo: (index: number) => this.scrollToActiveIndex(index)
    }
  }

  protected override bootstrap(): void {
    this.scrollerElementRef = this.scrollerContainer()!;
  }
}
