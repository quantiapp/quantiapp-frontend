import { Component, computed, input, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-icon',
  imports: [],
  template: `
    <svg class="icon-host" viewBox="0 0 15 15" fill="none">
      <use [attr.href]="spriteUrl()" [attr.stroke]="colorAttr() === 'stroke' ? 'currentColor' : ''" [attr.fill]="colorAttr() === 'fill' ? 'currentColor' : ''"></use>
    </svg> 
  `,
  styles: `
    :host { display: inline-flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
    .icon-host {
      width: 100%;
      height: 100%;
    }
  `
})
export class IconUi {
  key = input.required<string>();
  colorAttr = input.required<'stroke' | 'fill'>();
  now = signal<number>(0); // Date.now()
  spriteUrl = computed(() => `#${ this.key() }`);
}
