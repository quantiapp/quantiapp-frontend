import { Component, input, output } from '@angular/core';
import { Darkable } from '@shared/directives/darkable';
import { IconContainerContainer } from '@shared/ui/icon/icon-container.container';
import { SubmitableButton } from '@shared/directives/submitable-button';

@Component({
  selector: 'app-empty-state',
  imports: [Darkable, IconContainerContainer, SubmitableButton],
  template: `
    <div class="empty-state-container p-8 flex flex-col items-center justify-center text-center gap-4 bg-white/60 dark:bg-[#16171D]/60 border border-black/5 dark:border-white/5 rounded-3xl w-full">
      <div class="icon-box p-4 rounded-full bg-(color:--primary)/15 text-(--secondary) shrink-0" appDarkable="dark:text-(--dm-secondary)">
        <app-icon-container [width]="36" [height]="36" [key]="icon()"></app-icon-container>
      </div>

      <div class="flex flex-col gap-1 max-w-sm">
        <h3 class="text-base font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">
          {{ title() }}
        </h3>
        <p class="text-xs text-(--secondary)/60 leading-relaxed" appDarkable="dark:text-(--dm-secondary)/60">
          {{ description() }}
        </p>
      </div>

      @if (actionText()) {
        <button
        (click)="actionClicked.emit()"
        appSubmitableButton
        tailwindClassBackgroundColor="bg-(color:--primary)/63"
        tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
        class="mt-2 text-xs border border-[#C29B00] rounded-[0.563rem] px-4 py-1.5 font-medium text-black">
          {{ actionText() }}
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `
})
export class EmptyStateComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  actionText = input<string>();

  actionClicked = output<void>();
}
