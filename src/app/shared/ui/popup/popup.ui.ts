import { NgClass } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { PopupAction, PopupService } from '@core/services/pop-up.service';
import { Darkable } from '@shared/directives/darkable';

@Component({
  selector: 'q-popup',
  imports: [Darkable, NgClass],
  template: `
    @if (hasBackdrop()) {
      <div
      class="fixed w-screen h-svh top-0! left-0! inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
      aria-hidden="true"
      ></div>
    }

    @for (log of popup.logs(); track log.identifier) {
      <div class="toast bg-white max-w-[21.875rem] mx-auto rounded-3xl p-[20px_20px_20px_20px] w-full flex gap-4 justify-start items-stretch relative overflow-hidden drop-shadow-[0px_20px_50px_rgba(0,0,0,.2)]"
      appDarkable="dark:bg-(--dm-bg)"
      animate.enter="animate-popup-in"
      animate.leave="animate-popup-out"
      [style.marginTop.px]="!$first ? 20 : 0"
      >
        <div class="popup-icon">
          <div class="icon-bg w-12 h-12 rounded-2xl flex justify-center items-center"
          [style.backgroundColor]="'color-mix(in srgb, '+ popup.popupColors[log.status] +' 20%, transparent)'"
          [style.color]="popup.popupColors[log.status]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <symbol id="success">
                <path d="M12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0ZM10.5051 14.3674L7.83943 11.7C7.74386 11.6044 7.63041 11.5286 7.50555 11.4769C7.38069 11.4252 7.24686 11.3986 7.11171 11.3986C6.97657 11.3986 6.84274 11.4252 6.71788 11.4769C6.59302 11.5286 6.47956 11.6044 6.384 11.7C6.191 11.893 6.08257 12.1548 6.08257 12.4277C6.08257 12.7007 6.191 12.9624 6.384 13.1554L9.77829 16.5497C9.87358 16.6458 9.98695 16.722 10.1118 16.774C10.2367 16.826 10.3707 16.8528 10.506 16.8528C10.6413 16.8528 10.7753 16.826 10.9002 16.774C11.0251 16.722 11.1384 16.6458 11.2337 16.5497L18.2623 9.51943C18.3591 9.42426 18.4362 9.31086 18.489 9.18577C18.5418 9.06068 18.5693 8.92637 18.5699 8.79059C18.5705 8.65482 18.5443 8.52026 18.4926 8.39468C18.441 8.26911 18.365 8.15499 18.2691 8.05893C18.1731 7.96286 18.0591 7.88675 17.9336 7.83497C17.8081 7.78319 17.6735 7.75677 17.5378 7.75725C17.402 7.75772 17.2677 7.78507 17.1425 7.83771C17.0173 7.89036 16.9039 7.96727 16.8086 8.064L10.5051 14.3674Z" fill="currentColor"/>
              </symbol>
              <symbol id="error">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C18.6264 0 24 5.3736 24 12C24 18.6264 18.6264 24 12 24C5.3736 24 0 18.6264 0 12C0 5.3736 5.3736 0 12 0ZM14.7516 7.5516L12 10.3032L9.2484 7.5516L7.5516 9.2484L10.3032 12L7.5516 14.7516L9.2484 16.4484L12 13.6968L14.7516 16.4484L16.4484 14.7516L13.6968 12L16.4484 9.2484L14.7516 7.5516Z" fill="currentColor"/>
              </symbol>
              <symbol id="info">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6276 24 24 18.6276 24 12C24 5.3724 18.6276 0 12 0C5.3724 0 0 5.3724 0 12C0 18.6276 5.3724 24 12 24ZM10.2 17.9892C10.2 16.9488 10.9908 16.2 11.9892 16.2C13.0092 16.2 13.8 16.9488 13.8 17.9892C13.8 19.0296 13.0092 19.8 11.9892 19.8C10.9908 19.8 10.2 19.0296 10.2 17.9892ZM11.0064 4.8C10.9254 4.80008 10.8453 4.81655 10.7709 4.84841C10.6965 4.88028 10.6293 4.92687 10.5733 4.9854C10.5174 5.04392 10.4738 5.11317 10.4454 5.18896C10.4169 5.26475 10.404 5.34551 10.4076 5.4264L10.7748 13.8264C10.7816 13.9809 10.8478 14.1268 10.9596 14.2337C11.0714 14.3406 11.2201 14.4002 11.3748 14.4H12.6264C12.7811 14.4002 12.9298 14.3406 13.0416 14.2337C13.1534 14.1268 13.2196 13.9809 13.2264 13.8264L13.5924 5.4264C13.596 5.34541 13.5831 5.26454 13.5545 5.18867C13.526 5.1128 13.4824 5.04351 13.4263 4.98496C13.3702 4.92642 13.3028 4.87985 13.2283 4.84806C13.1537 4.81627 13.0735 4.79992 12.9924 4.8H11.0064Z" fill="currentColor"/>
              </symbol>
              <use [attr.href]="'#' + log.status"></use>
            </svg>
          </div>
        </div>
        <div class="popup-content">
          <h1 class="text-lg font-bold" appDarkable="dark:text-(--dm-secondary)">{{ popup.popupStatement[log.status] }}</h1>
          <p class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ log.message }}</p>
          @if (log.actions) {
            <div class="actions mt-3 flex gap-2 justify-start items-center">
              @for (action of log.actions; track $index) {
                <button
                (click)="handleAction(action)"
                class="text-xs px-4 py-[9px] w-fit rounded-[12px] font-semibold text-(--secondary)"
                [ngClass]="{
                  'bg-white border border-(--secondary)/10': action.variant === 'neutral'
                }"
                [style.backgroundColor]="action.variant !== 'neutral' ? popup.popupColors[action.variant] : null">
                  {{ action.label }}
                </button>
              }
            </div>
          }
        </div>
        
        <div class="bar absolute bottom-0 left-0 w-full h-1.5"
        [class]="(log.duration && log.duration > 0) ? 'animated' : ''"
        [style]="(log.duration && log.duration > 0) ? '--animation-duration: '+ log.duration +'s' : ''"
        [style.backgroundColor]="popup.popupColors[log.status]"
        ></div>
      </div>
    }
  `,
  styles: `
    .bar.animated {
      animation: shrink var(--animation-duration) linear forwards;
    }

    @keyframes shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
  `
})
export class PopupUi {
  popup = inject(PopupService);
  hasBackdrop = computed(() => this.popup.logs().some(log => log.backdrop))

  constructor() {
    effect(() => {
      if(this.hasBackdrop()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  handleAction(action: PopupAction): void {
    action.action();
  }
}
