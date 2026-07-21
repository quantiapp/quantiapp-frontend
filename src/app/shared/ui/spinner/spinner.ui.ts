import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  template: `
    <span class="loader"></span>
  `,
  styles: `
    :host{
      --dimentions: 15px;
    }
    .loader {
        width: var(--dimentions);
        height: var(--dimentions);
        border-top: currentColor;
        border-radius: 50%;
        display: inline-block;
        border-top: 3px solid;
        border-right: 3px solid transparent;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }
      
    @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
    }
  `
})
export class SpinnerUi {
  
}
