import { NgClass } from '@angular/common';
import { Component, forwardRef, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'q-toggle',
  imports: [Darkable, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ],
  template: `
    <div (click)="toggle()" class="toggle-container w-[44px] rounded-full bg-white border border-(--primary) relative px-1.5 py-[5px]"
    [ngClass]="value() ? 'bg-(--primary)!' : ''"
    appDarkable="dark:bg-(--dm-bg)"
    >
      <div class="tracker w-[15px] h-[15px] duration-200 bg-(--primary) translate-x-0 rounded-full"
      [style.backgroundColor]="value() ? 'white' : ''"
      [class]="value() ? 'translate-x-full!' : ''"
      ></div>
    </div>
  `,
  styles: ``
})
export class ToggleComponent implements ControlValueAccessor {

  value = signal<boolean>(false);
  isDisabled = signal<boolean>(false);

  change = output<boolean>();
  
  toggle(): void {
    this.value.update(value => value = !value);

    this.change.emit(this.value())
    this.onChange(this.value());
    this.onTouched();
  }
  
  onChange: (value: boolean) => void = () => {}
  onTouched: () => void = () => {}

  writeValue(obj: any): void { this.value.set(obj) }
  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouched = fn }
  setDisabledState?(isDisabled: boolean): void { this.isDisabled.set(isDisabled) }

}
