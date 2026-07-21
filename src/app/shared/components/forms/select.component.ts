import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, ElementRef, forwardRef, HostListener, input, signal, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconContainerContainer } from "@shared/ui/icon/icon-container.container";
import { TailwindClassApplier } from "@shared/directives/tailwind-class-applier";

@Component({
  selector: 'q-select',
  imports: [NgTemplateOutlet, IconContainerContainer, TailwindClassApplier],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="select-container relative overflow-hidde flex flex-col w-fit text-sm text-(--secondary)"
    appTailwindClassApplier [tailwindClassesArray]="appearence()"
    [class.disabled]="isDisabled()">
      <!-- TRIGGER -->
      <div
      class="select-trigger text-(--secondary) flex justify-between gap-2.5 items-center w-full bg-[#FAFAFA] relative py-2.5 px-4 rounded-[10px] border border-black/5"
      appTailwindClassApplier [tailwindClassesArray]="triggerAppearence()"
      (click)="toggle()"
      [class.open]="isOpen()">
        <span class="selected-text text-(--secondary)" [class.placeholder]="!displayValue()">
          @if(displayValue() && multiple()){
            <div class="multiple-container flex gap-1 justify-start items-center">
              @for (value of displayValue().slice(0, 3); track $index) {
                <div (click)="onItemClick($event, value)" class="bg-(--primary)/40 rounded px-[7px] py-0.5 w-fit text-sm flex gap-[0.375rem] justify-between items-center text-(--secondary)">
                  @if(displayKey() === 'icon'){
                    <app-icon-container [width]="23" [height]="23" [key]="value"></app-icon-container>
                  } @else {
                    {{ value }}
                  }
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.91663 7.08334L7.04142 2.95856" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2.91663 2.91669L7.04142 7.04148" stroke="#202020" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              }
              @if(displayValue().length > 3){
                <div (click)="$event.stopPropagation()" class="bg-(--primary)/40 rounded px-[7px] py-0.5 w-fit text-sm flex gap-[0.375rem] justify-between items-center text-(--secondary)">
                  +{{ displayValue().slice(3).length }}
                </div>
              }
            </div>
          } @else if(displayValue() && !multiple()){
            @if(displayKey() === 'icon'){
              <app-icon-container [key]="displayValue()" [width]="displayKeyIconDimentions()" [height]="displayKeyIconDimentions()"></app-icon-container>
            } @else {
              @if(triggerTemplate()) {
                <ng-container *ngTemplateOutlet="triggerTemplate(); context: { $implicit: selectedOption() }"></ng-container>
              } @else {
                <span class="text-(--secondary)">{{ displayValue() }}</span>
              }
            }
          } @else  {
            <span class="text-(--secondary)/60">{{ placeholder() }}</span>
          }
        </span>
        <span class="arrow text-(--secondary)">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.375 6.25L7.5 9.375L10.625 6.25" stroke="#16171D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>

      <!-- DROPDOWN -->
       <div class="dropdown absolute top-[calc(100%+8px)] w-max z-101 rounded-[10px] max-h-[230px] bg-[#FAFAFA] text-(--secondary) border border-black/5 dark:border-white/5 shadow-lg px-2.5 overflow-y-auto no-scrollbar transition-all duration-200 ease-out origin-top"
        [class.opacity-100]="isOpen()"
        [class.scale-100]="isOpen()"
        [class.translate-y-0]="isOpen()"
        [class.pointer-events-auto]="isOpen()"
        [class.visible]="isOpen()"
        [class.opacity-0]="!isOpen()"
        [class.scale-95]="!isOpen()"
        [class.-translate-y-2]="!isOpen()"
        [class.pointer-events-none]="!isOpen()"
        [class.invisible]="!isOpen()"
        appTailwindClassApplier
        [tailwindClassesArray]="dropdownAppearence()"
        >
         <ul class="options-list flex flex-col gap-2 py-2.5"
          [class]="displayKey() === 'icon' ? 'flex-row! flex-wrap gap-x-2.5 justify-start items-center' : ''"
         >
           <!-- MODO GRUPOS -->
           @if (groups().length > 0) {
             @for (group of groups(); track group.label) {
               <li class="group-title py-1 text-black/40">{{ group.label }}</li>
               @for (option of group.options; track option.value) {
                 <ng-container *ngTemplateOutlet="listItemRenderer; context: { $implicit: option }"></ng-container>
               }
             }
           } 
           <!-- MODO SIMPLES -->
           @else {
            @for (option of options(); track option.value) {
              <ng-container *ngTemplateOutlet="listItemRenderer; context: { $implicit: option }"></ng-container>
            } @empty {
              <p class="text-(--secondary)/60 text-sm">Sem informações para mostrar</p>
            }
           }
         </ul>
       </div>
    </div>

    <!-- ITEM TEMPLATE -->
    <ng-template #listItemRenderer let-option>
      <li 
        class="option-item flex gap-x-3 border border-black/12 duration-100 px-1.5 py-[5px] rounded-lg justify-start items-center" 
        [class.grouped]="groups().length > 0"
        (click)="selectOption(option)"
        [class.selected]="isSelected(option.value)"
        [class]="displayKey() === 'icon' ? 'w-fit' : ''"
        [class]="isSelected(option.value) ? 'text-(--secondary)/60' : ' text-(--secondary)'"
        >
        
        <!-- Checkbox Fake (Só aparece se for multiple) -->
        @if (multiple() && displayKey() !== 'icon') {
          <span class="checkbox w-5 h-5 bg-white border border-black/12 rounded-[5px] flex justify-center items-center" [class.checked]="isSelected(option.value)">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 0.91748L3.05376 7.86376L0 4.81003L0.91748 3.89251L3.05376 6.02882L9.08259 0L10.0001 0.91748Z" fill="white"/>
            </svg>
          </span>
        }

        <!-- Conteúdo (Template ou Texto) -->
        @if (optionTemplate()) {
          <ng-container *ngTemplateOutlet="optionTemplate(); context: { $implicit: option }"></ng-container>
        } @else {
          {{ option.label }}
        }
      </li>
    </ng-template>
  `,
  styles: `

  :host {
    &.ng-invalid.ng-touched {
      .select-trigger {
        border-color: red;
      }
    }
  }

  .option-item.selected{
    background-color: var(--primary);
  }
  span.checkbox svg{
    visible: none;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  span.checkbox.checked svg{
    visible: visible;
  }

  span.checkbox.checked{
    background-color: var(--secondary);
    color: white;
  }
  `
})
export class SelectComponent implements ControlValueAccessor {
  placeholder = input<string>('Selecione uma opção');
  appearence = input<string[]>([]);
  triggerAppearence = input<string[]>([]);
  dropdownAppearence = input<string[]>([]);

  options = input<SelectOption[]>([]);
  groups = input<SelectGroup[]>([]);
  displayKey = input<keyof SelectOption>('label');
  displayKeyIconDimentions = input<number>(23);

  optionTemplate = contentChild<TemplateRef<any>>('option');
  triggerTemplate = contentChild<TemplateRef<any>>('trigger');

  isOpen = signal<boolean>(false);
  value = signal<any>(null);

  selectedOption = computed(() => this.options().find(opt => opt.value === this.value()));

  multiple = input<boolean>(false);

  isDisabled = signal<boolean>(false);

  constructor(private element: ElementRef<any>) {}

  private flatOptions = computed(() => {
    if(this.groups().length > 0) return this.groups().flatMap(g => g.options);
    return this.options();
  });

  displayValue = computed(() => {
    const val = this.value();

    if(val === null || val === undefined || (Array.isArray(val) && val.length === 0)){
      return null;
    }

    if(this.multiple() && Array.isArray(val)) {
      const selectOptions = this.flatOptions().filter(opt => val.includes(opt.value));
      return selectOptions.map(opt => opt[this.displayKey()]);
    }

    const selected = this.flatOptions().find(opt => opt.value === val);
    return selected ? selected[this.displayKey()] : null;
  });

  toggle() {
    if(!this.isDisabled()){
      this.isOpen() ? this.close() : this.open();
    }
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.onTouched();
  }

  selectOption(option: SelectOption) {
    const currentVal = this.value();

    if(this.multiple()) {
      let newVal: any[];

      if(Array.isArray(currentVal)){
        if(currentVal.includes(option.value)){
          newVal = currentVal.filter(v => v !== option.value);
        } else {
          newVal = [...currentVal, option.value];
        }
      } else {
        newVal = [option.value];
      }

      this.value.set(newVal);
      this.onChange(newVal);
    } else {
      this.value.set(option.value);
      this.onChange(option.value);
      this.isOpen.set(false);
    }
    this.onTouched();
  }

  onItemClick(event: MouseEvent, itemValue: any) {
    event.stopPropagation();
    this.removeItem(itemValue);
  }

  removeItem(valueToRemove: any) {
    const currentVal = this.value();
    const options = this.flatOptions();

    if(Array.isArray(currentVal)){

      const clickedItem = options.find(v => v[this.displayKey()] === valueToRemove);

      if(clickedItem){
        const newVal = currentVal.filter(v => v !== clickedItem.value);

        this.value.set(newVal)
        this.onChange(newVal);
        this.onTouched();
      }
    }
  }

  isSelected(optionValue: string): boolean {
    const val = this.value();
    if(this.multiple() && Array.isArray(val)) {
      return val.includes(optionValue);
    }

    return val === optionValue;
  }

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(obj: any): void { this.value.set(obj) }
  registerOnChange(fn: any): void { this.onChange = fn }
  registerOnTouched(fn: any): void { this.onTouched = fn }

  setDisabledState?(isDisabled: boolean): void { this.isDisabled.set(isDisabled) }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if(!this.element.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

}

export interface SelectOption {
  label: string,
  value: any,
  icon?: string
}

export interface SelectGroup {
  label: string,
  options: SelectOption[],
  disabled?: boolean
}