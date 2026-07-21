import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, effect, inject, input, model, PLATFORM_ID, signal, TemplateRef } from '@angular/core';
import { BodyElementOverflower } from '@shared/directives/body-element-overflower';
import { Darkable } from '@shared/directives/darkable';

@Component({
  selector: 'q-drawer',
  imports: [NgTemplateOutlet, NgClass, BodyElementOverflower, Darkable],
  template: `
    <ng-container *ngTemplateOutlet="invokerElement(); context: invokerTemplateContext"></ng-container>

    <section class="drawer" appBodyElementOverflower [limitBody]="this.visible()">
      <div class="drawer-overlay fixed top-0 left-0 w-full h-full backdrop-blur-[10px] bg-black/62 z-[110]"
      [ngClass]="{
        'hidden': !this.visible() && this.firstTime(),
        'disappear': (!this.visible() && !this.firstTime()),
        'appear': this.visible()
      }"
      (click)="onOutsideClick()"
      ></div>
      <div
      class="q-panel fixed w-full z-111 h-full overflow-y-auto top-0 max-w-[23.438rem] duration-500"
      [style.right.%]="visible() ? 0 : -100"
      >
        <div
        class="panel-background bg-white w-full min-h-screen pb-4 px-4"
        appDarkable="dark:bg-(--dm-bg)"
        >
          <div class="drawer-closer bg-white z-10 sticky top-0 py-4 px-2.5 flex justify-end items-center"
          appDarkable="dark:bg-(--dm-bg)"
          >
            <button (click)="close()"
            appDarkable="dark:text-(--dm-secondary)"
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_325_2832)">
                <path d="M8.75 21.25L21.1244 8.87564" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.75 8.75002L21.1244 21.1244" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                <clipPath id="clip0_325_2832">
                <rect width="30" height="30" fill="white"/>
                </clipPath>
                </defs>
              </svg>
            </button>
          </div>
          <ng-container *ngTemplateOutlet="panelTemplate(); context: panelTemplateContext"></ng-container>
        </div>
      </div>
    </section>
  `,
  styles: `
    .drawer-overlay.appear{
      animation: appear .3s forwards ease-in-out;
    }
    .drawer-overlay.disappear{
        animation: disappear .6s forwards ease-in-out;
    }

    @keyframes appear {
        from{
            opacity: 0;
        }
        to{
            opacity: 1;
            display: block;
        }
    }

    @keyframes disappear {
        50%{
            opacity: 0;
        }
        to{
            opacity: 0;
            display: none;
            z-index: -1 !important;
            position: relative;
        }
    }
  `
})
export class DrawerComponent {

  constructor() {
    effect(() => {
      if(this.visible()) {
        this.open();
      } else {
        this.close();
      }
    });
  }

  closeOnOutsideClick = input<boolean>(false);
  platformId = inject(PLATFORM_ID);

  visible = model<boolean>(false);
  firstTime = signal(true);

  panelTemplate = contentChild<TemplateRef<any>>("panel");
  invokerElement = contentChild<TemplateRef<any>>('invoker');

  onOutsideClick(): void{
    if(!this.closeOnOutsideClick()) return;
    this.close();
  }
  
  open(): void{
    this.visible.set(true);
    this.firstTime.set(false);
  }

  close(): void{
    this.visible.set(false);
  }

  get panelTemplateContext() {
    return {
      $implicit: {},
      close: () => this.close()
    }
  }

  get invokerTemplateContext() {
    return {
      $implicit: {},
      open: () => this.open(),
    }
  }
}
