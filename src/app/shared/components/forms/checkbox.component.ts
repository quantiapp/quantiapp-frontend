import { NgClass } from '@angular/common';
import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'q-checkbox',
  imports: [NgClass, Darkable],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <div [id]="id()" (click)="toggle()" class="check-container bg-white relative py-2.5 px-4 duration-100 rounded-[10px] border border-black/15 dark:border-white/15 w-[30px] h-[33px] flex justify-center items-center"
    [ngClass]="value() ? 'bg-(--primary)! border-none!' : ''"
    appDarkable="dark:bg-(--dm-bg)"
    >
      @if(value()) {
        <div class="check">
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 3.83333L3.125 5.95833C3.51614 6.34948 4.15052 6.34948 4.54167 5.95833L9.5 1" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class CheckboxComponent implements ControlValueAccessor {

  id = input.required<string>();
  value = signal<boolean>(false);
  isDisabled = signal<boolean>(false);

  change = output<boolean>();

  toggle(): void {
    this.value.update(val => val = !val);

    this.change.emit(this.value());
    this.onChange(this.value());
    this.onTouched();
  }

  onChange: (change: boolean) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(obj: any): void { this.value.set(obj) }
  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void {  this.onTouched = fn }
  setDisabledState?(isDisabled: boolean): void { this.isDisabled.set(isDisabled) }

}
