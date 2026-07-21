import { Component, input, model } from '@angular/core';
import { DialogComponent } from "@shared/components/dialog.component";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-base-dialog',
  imports: [DialogComponent, SubmitableButton, Darkable],
  template: `
    <q-dialog [(visible)]="openDialog">
      <ng-template #panel let-closeDialogFn="close" let-confirmAndCloseFn="confirmAndClose">
        <div class="dialog-panel flex flex-col gap-6 p-4">
          <ng-content select="[header]"></ng-content>
          
          <ng-content select="[body]"></ng-content>

          <div class="dialog-footer flex gap-3 justify-end items-center">
            <button (click)="onCancel(closeDialogFn)"
            class="w-fit text-sm text-(--secondary)/60 border border-(--secondary)/60 dark:border-(--dm-secondary)/60 rounded-[0.563rem] px-2 py-1 font-medium"
            appDarkable="dark:text-(--dm-secondary)/60"
            >
              Cancelar
            </button>

            <button
            (click)="onConfirm(confirmAndCloseFn)"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1 font-medium">
              Continuar
            </button>
          </div>
        </div>
      </ng-template>
    </q-dialog>
  `,
  styles: ``
})
export class BaseDialogUi {
  openDialog = model.required<boolean>();
  onConfirmFnInp = input.required<() => void>();

  onCancel(cancelFn: () => void) {
    cancelFn();
  }

  onConfirm(confirmAndCloseFn: () => void) {
    this.onConfirmFnInp()();
    
    confirmAndCloseFn();
  }
}
