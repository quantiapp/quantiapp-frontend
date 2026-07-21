import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, ElementRef, input, TemplateRef, viewChild } from '@angular/core';
import { Scroller } from '@core/abstracts/scroller.abstract.class';
import { NoDataMessageUi } from "@shared/ui/no-data-message/no-data-message.ui";
import { GenericCardSkeleton } from "@shared/ui/generic-card-skeleton/generic-card-skeleton";

@Component({
  selector: 'q-scroller',
  imports: [NgTemplateOutlet, NoDataMessageUi, GenericCardSkeleton],
  template: `
    <div class="scroller-container overflow-hidden relative" #scrollerElementRef>
      @if(!isLoading()){
        <div class="items-container flex gap-[10px] items-stretch"
        [class.justify-start]="itemsArray().length > 0"
        [class.justify-center]="itemsArray().length === 0"
        [class.w-full]="itemsArray().length === 0"
        [style.width]="itemsArray().length > 0 ? 'fit-content' : '100%'"
        >
          @for (item of itemsArray(); track $index) {
            <ng-container *ngTemplateOutlet="itemTemplate(); context: { $implicit: item, $index: $index, onClick: clickContext.scrollTo }"></ng-container>
          } @empty {
            <div class="w-full flex justify-center items-center py-4">
              <ng-content select="[onEmpty]">
                <no-data-message class="w-full"></no-data-message>
              </ng-content>
            </div>
          }
        </div>
      } @else {
        <!-- <coin-spinner /> -->
        <div class="skeletons-container flex gap-[10px] justify-start items-stretch">
          @for (i of [1,2,3]; track $index) {
            <app-generic-card-skeleton [type]="cardType()"></app-generic-card-skeleton>
          }
        </div>
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
  cardType = input<'account' | 'goal'>('account');
  
  get clickContext(){
    return {
      scrollTo: (index: number) => this.scrollToActiveIndex(index)
    }
  }

  protected override bootstrap(): void {
    this.scrollerElementRef = this.scrollerContainer()!;
    this.scrollerElementRef.nativeElement.addEventListener('touchmove', (e) => this.carouselTouchMoveEventHandler(e), { passive: true });
    this.scrollerElementRef.nativeElement.addEventListener('wheel', (e) => this.carouselWheelEventHandler(e), { passive: false });
    this.scrollerElementRef.nativeElement.addEventListener('touchstart', (e) => this.captureInitialXOnTouchStart(e), { passive: false });
  }
}
