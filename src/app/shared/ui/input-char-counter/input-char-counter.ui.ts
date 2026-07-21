import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, effect, input, signal, TemplateRef } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'q-control-char-counter',
  imports: [Darkable, NgTemplateOutlet],
  template: `
    <div class="control-container">
      <div class="form-control flex flex-col gap-2.5">
          <div class="control-header flex justify-between items-center">
            <label [for]="'#' + id()" class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ label() }}</label>
            <div class="counter">
              <span class="text-sm text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">
                {{ limit() - current() }} / {{ limit() }}
              </span>
            </div>
          </div>
          <div class="input">
            <ng-container *ngTemplateOutlet="inputTemplate();"></ng-container>
          </div>
    </div>
  `,
  styles: ``
})
export class ControlCharCounterUi{
  current = signal<number>(0);
  limit = input.required<number>();
  id = input.required<string>();
  label = input.required<string>();
  inputTemplate = contentChild<TemplateRef<any>>('templateInput');
  control = input.required<AbstractControl>();

  constructor() {
    effect((onCleanup) => {
      const formControl = this.control();
      if(!formControl) return;

      this.current.set(formControl.value.length || 0);

      const subscription = formControl.valueChanges.subscribe(formValue => {
        this.current.update(val => val = formValue.length)
      })
      onCleanup(() => subscription.unsubscribe());
    })
  }
}
