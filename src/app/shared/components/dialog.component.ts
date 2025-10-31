import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, inject, input, output, PLATFORM_ID, signal, TemplateRef } from '@angular/core';
import { BodyElementOverflower } from "@shared/directives/body-element-overflower";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'q-dialog',
  imports: [NgTemplateOutlet, NgClass, BodyElementOverflower, Darkable],
  template: `
  
    <ng-container *ngTemplateOutlet="invokerElement(); context: invokerTemplateContext"></ng-container>

    <section class="dialog" appBodyElementOverflower [limitBody]="this.visible()">
      <div class="dialog-overlay fixed top-0 left-0 w-full h-full bg-black/62 z-[110]"
      [ngClass]="{
        'hidden': !this.visible() && this.firstTime(),
        'disappear': (!this.visible() && !this.firstTime()),
        'appear': this.visible()
      }"
      (click)="onOutsideClick()"
      ></div>
      <div
      [ngClass]="{
        'hidden': !this.visible() && this.firstTime(),
        'zoom-out': (!this.visible() && !this.firstTime()),
        'zoom-in': this.visible
      }"
      class="q-panel fixed bg-white rounded-2xl z-[111] w-full left-[50%] top-[50%] -translate-[50%] max-w-[325px]"
       appDarkable="dark:bg-(color:--secondary)"
      >
         <ng-container *ngTemplateOutlet="panelTemplate(); context: panelTemplateContext"></ng-container>
      </div>
    </section>
  `,
  styles: `
    .dialog-overlay.appear{
      animation: appear .3s forwards ease-in-out;
    }
    .dialog-overlay.disappear{
        animation: disappear .6s forwards ease-in-out;
    }

    .q-panel.zoom-in{
      animation: zoomIn .3s forwards ease-in-out;
    }
    .q-panel.zoom-out{
        animation: zoomOut .6s forwards ease-in-out;
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
        /* from{
            opacity: 0;
        } */
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

    @keyframes zoomIn {
        from{
            opacity: 0;
            transform: scale(0.5);
        }
        to{
            opacity: 1;
            transform: scale(1);
            display: block;
        }
    }

    @keyframes zoomOut {
        /* from{
            opacity: 0;
        } */
        50%{
            opacity: 0;
            transform: scale(0.5);
        }
        to{
            opacity: 0;
            transform: scale(0.5);
            display: none;
            z-index: -1 !important;
            position: fixed;
        }
    }
  `
})
export class DialogComponent {

  confirm = output<boolean>();
  cancel = output<boolean>();
  closeOnOutsideClick = input<boolean>(false);
  platformId = inject(PLATFORM_ID);

  visible = signal<boolean>(false);
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

  onConfirm(): void{
    this.close();
    this.confirm.emit(true);
  }

  onCancel(): void{
    this.close();
    this.cancel.emit(true);
  }

  get panelTemplateContext() {
    return {
      $implicit: {},
      close: () => this.close(),
      onConfirm: () => this.onConfirm(),
      onCancel: () => this.onCancel()
    }
  }

  get invokerTemplateContext() {
    return {
      $implicit: {},
      open: () => this.open(),
    }
  }

}
