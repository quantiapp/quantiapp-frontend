import { Component, computed, forwardRef, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserStore } from '@core/data/user-store.data';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'q-money-input',
  imports: [ NgxMaskDirective, FormsModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoneyInputComponent),
      multi: true
    }
  ],
  template: `
    <input
    type="text"
    mask="separator.2"
    [thousandSeparator]="formattingRules().thousand"
    [decimalMarker]="formattingRules().decimal"
    [id]="id()"
    class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
    placeholder="0,00"
    inputmode="decimal"
    (change)="this.registerChange()"
    enterkeyhint="enterKeyHint()"
    [(ngModel)]="value"
    >
  `,
  styles: ``
})
export class MoneyInputComponent implements ControlValueAccessor {

  id = input.required<string>();
  enterKeyHint = input<EnterKeyHint>('go');

  value = model<number | null>(null);
  isDisabled = signal<boolean>(false);

  private userStore = inject(UserStore);

  userLocale = computed(() => this.userStore.settings()?.locale);

  formattingRules = computed(() => {
    const locale = this.userLocale();
    const parts = new Intl.NumberFormat(locale).formatToParts(1000.5);

    let groupChar = parts.find(p => p.type === 'group')?.value || '.';
    const decimalChar: "." | "," = (parts.find(p => p.type === 'decimal')?.value || ',') as "." | ",";

    if (groupChar.trim() === '') {
        groupChar = '.'; 
    }
    
    return {
      thousand: groupChar,
      decimal: decimalChar
    }
  });

  registerChange(): void {
    this.onChanged(this.value())
    this.onTouched();
  } 

  onChanged: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(obj: any): void { this.value.set(obj) }
  registerOnChange(fn: any): void { this.onChanged = fn }
  registerOnTouched(fn: any): void { this.onTouched = fn }
  setDisabledState?(isDisabled: boolean): void { this.isDisabled.set(isDisabled) }
  
}

export type EnterKeyHint = 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';