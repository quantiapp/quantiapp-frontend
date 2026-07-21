import { Component, input } from '@angular/core';
import { IconUi } from "./icon.ui";
import { TailwindClassApplier } from "@shared/directives/tailwind-class-applier";

@Component({
  selector: 'app-icon-container',
  imports: [IconUi, TailwindClassApplier],
  template: `
    <div class="icon p-1 relative rounded duration-initial"
    appTailwindClassApplier
    [tailwindClassesArray]="tailwindClassArray()"
    [style.backgroundColor]="bgColor()"
    [style.color]="iconColor()"
    [style.width.px]="width()"
    [style.height.px]="height()"
    >
      <app-icon [key]="key()" [colorAttr]="colorAttr()"></app-icon>
    </div>
  `,
  styles: ``
})
export class IconContainerContainer {
  key = input.required<string>();
  colorAttr = input<'stroke' | 'fill'>('stroke');
  bgColor = input<string>('transparent');
  iconColor = input<string>('inherit');
  width = input<number>(28);
  height = input<number>(28);
  tailwindClassArray = input<string[]>([]);
}
