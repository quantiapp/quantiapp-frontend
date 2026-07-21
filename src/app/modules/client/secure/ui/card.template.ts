import { Component, input } from '@angular/core';
import { TailwindClassApplier } from "@shared/directives/tailwind-class-applier";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-card',
  imports: [TailwindClassApplier, Darkable],
  template: `
    <div class="card-template bg-white rounded-[1.25rem] p-4 w-full flex flex-col gap-4"
    appDarkable="dark:bg-(color:--secondary)/60"
    appTailwindClassApplier
    [tailwindClassesArray]="tailwindClassesArray()">
      <div class="card-header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="content">
        <ng-content select="[content]"></ng-content>
      </div>
      <div class="foot">
        <ng-content select="[foot]"></ng-content>
      </div>
    </div>
  `,
  styles: `
  .card-header:not(:has(*)),
  .content:not(:has(*)),
  .foot:not(:has(*))
  {
    display: none;
  }
  `
})
export class CardTemplate {
  tailwindClassesArray = input<string[]>([]);
}
