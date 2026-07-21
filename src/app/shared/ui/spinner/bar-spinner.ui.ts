import { Component, input } from '@angular/core';

@Component({
  selector: 'app-bar-spinner',
  imports: [],
  template: `
    <span class="loader"></span>
  `,
  styles: `
    .loader {
      position: relative;
      display: inline-block;
      margin: -3px auto;
      background: currentColor;
      width: 3px;
      height: 12px;
      animation: scaleY 1s infinite ease-in-out;
      animation-delay: -0.16s;
      transform-origin: center;
    }

    .loader::before,
    .loader::after {
      content: '';
      position: absolute;
      top: 0;
      width: 3px;
      height: 12px;
      background: inherit;
      animation: scaleY 1s infinite ease-in-out;
      transform-origin: center;
    }

    .loader::before {
      left: -6px;
      animation-delay: -0.32s;
    }

    .loader::after {
      left: 6px;
    }

    @keyframes scaleY {
      0%, 80%, 100% {
        transform: scaleY(0.4);
      }
      40% {
        transform: scaleY(1);
      }
    }

  `
})
export class BarSpinnerUi {
  
}
