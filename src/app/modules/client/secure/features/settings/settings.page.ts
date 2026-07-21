import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Darkable } from '@shared/directives/darkable';
import { SubmitableButton } from '@shared/directives/submitable-button';
import { SelectComponent, SelectOption } from '@shared/components/forms/select.component';
import { BarSpinnerUi } from '@shared/ui/spinner/bar-spinner.ui';
import { IconContainerContainer } from '@shared/ui/icon/icon-container.container';
import { CardTemplate } from '@client/secure/ui/card.template';
import { SettingsFacade } from './settings.facade';
import { AppLanguage, AppLocale, AppThemeMode } from '@core/enums/user-setting.enum';
import { PopupService } from '@core/services/pop-up.service';

@Component({
  selector: 'app-settings-page',
  imports: [Darkable, SubmitableButton, SelectComponent, ReactiveFormsModule, BarSpinnerUi, IconContainerContainer, CardTemplate],
  template: `
    <div class="section-container py-8 flex flex-col min-h-screen gap-6 limited-container">
      
      <!-- PANEL HEADER & AVATAR -->
      <div class="flex flex-col items-center justify-center gap-4 py-2">
        <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Definições Gerais</h1>
        <div class="w-24 h-24 rounded-full bg-[#F1C40F] flex items-center justify-center text-black font-semibold text-4xl shadow-md">
          {{ userInitial() }}
        </div>
      </div>

      <!-- CARDS CONTAINER -->
      <div class="flex flex-col gap-5 max-w-[28rem] mx-auto w-full">

        <!-- CARD 1: MAIN SETTINGS -->
        <app-card>
          <div content class="flex flex-col gap-4">

            <!-- MOEDA PADRÃO FORM -->
            <form [formGroup]="currencyForm" (ngSubmit)="saveCurrency()" class="flex flex-col items-end gap-1.5">
              <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-center">
                <div class="label text-(--secondary) text-sm flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
                  <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
                    <app-icon-container [width]="28" [height]="28" [key]="'dolar'" [colorAttr]="'fill'"></app-icon-container>
                  </div>
                  <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Moeda padrão</span>
                </div>
                <div class="form-control flex items-center">
                  <q-select
                  [triggerAppearence]="['px-2!', 'py-1!', 'bg-white!', 'rounded-[9px]!', 'border-black/12!']"
                  id="settings_currency"
                  [options]="currencyOptions()"
                  formControlName="currency"
                  >
                    <ng-template #option let-option>
                      <div style="display: flex; align-items: center; gap: 8px">
                        <span>{{ option.label }}</span>
                      </div>
                    </ng-template>
                  </q-select>
                </div>
              </div>

              @if (currencyForm.dirty && currencyForm.get('currency')?.value !== initialCurrency()) {
                <button
                type="submit"
                appSubmitableButton
                tailwindClassBackgroundColor="bg-(color:--primary)/63"
                tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-3 py-1 font-medium text-black"
                [disabled]="currencyForm.invalid || isUpdatingCurrency()">
                  @if (isUpdatingCurrency()) {
                    <app-bar-spinner></app-bar-spinner>
                  } @else {
                    Salvar alterações
                  }
                </button>
              }
            </form>

            <!-- IDIOMA FORM -->
            <form [formGroup]="languageForm" (ngSubmit)="saveLanguage()" class="flex flex-col items-end gap-1.5">
              <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-center">
                <div class="label text-(--secondary) text-sm flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
                  <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
                    <app-icon-container [width]="28" [height]="28" [key]="'translation'" [colorAttr]="'fill'"></app-icon-container>
                  </div>
                  <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Idioma</span>
                </div>
                <div class="form-control flex items-center">
                  <q-select
                  [triggerAppearence]="['px-2!', 'py-1!', 'bg-white!', 'rounded-[9px]!', 'border-black/12!']"
                  id="settings_language"
                  [options]="languageOptions"
                  formControlName="language"
                  >
                    <ng-template #option let-option>
                      <div style="display: flex; align-items: center; gap: 8px">
                        <span>{{ option.label }}</span>
                      </div>
                    </ng-template>
                  </q-select>
                </div>
              </div>

              @if (languageForm.dirty && languageForm.get('language')?.value !== initialLanguage()) {
                <button
                type="submit"
                appSubmitableButton
                tailwindClassBackgroundColor="bg-(color:--primary)/63"
                tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-3 py-1 font-medium text-black"
                [disabled]="languageForm.invalid || isUpdatingLanguage()">
                  @if (isUpdatingLanguage()) {
                    <app-bar-spinner></app-bar-spinner>
                  } @else {
                    Salvar alterações
                  }
                </button>
              }
            </form>

            <!-- TEMA FORM -->
            <form [formGroup]="themeForm" (ngSubmit)="saveTheme()" class="flex flex-col items-end gap-1.5">
              <div class="input-container border border-black/5 dark:border-white/5 rounded-[10px] w-full p-4 flex justify-between items-center">
                <div class="label text-(--secondary) text-sm flex gap-4 justify-start items-center" appDarkable="dark:text-(--dm-secondary)">
                  <div class="icon p-2.5 w-fit border border-(--secondary) dark:border-(--dm-secondary) rounded-[10px]">
                    <app-icon-container [width]="28" [height]="28" [key]="'theme'" [colorAttr]="'fill'"></app-icon-container>
                  </div>
                  <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Tema</span>
                </div>
                <div class="form-control flex items-center">
                  <q-select
                  [triggerAppearence]="['px-2!', 'py-1!', 'bg-white!', 'rounded-[9px]!', 'border-black/12!']"
                  id="settings_theme"
                  [options]="themeOptions"
                  formControlName="theme"
                  >
                    <ng-template #option let-option>
                      <div style="display: flex; align-items: center; gap: 8px">
                        <span>{{ option.label }}</span>
                      </div>
                    </ng-template>
                  </q-select>
                </div>
              </div>

              @if (themeForm.dirty && themeForm.get('theme')?.value !== initialTheme()) {
                <button
                type="submit"
                appSubmitableButton
                tailwindClassBackgroundColor="bg-(color:--primary)/63"
                tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                class="w-fit text-sm border border-[#C29B00] rounded-[0.563rem] px-3 py-1 font-medium text-black"
                [disabled]="themeForm.invalid || isUpdatingTheme()">
                  @if (isUpdatingTheme()) {
                    <app-bar-spinner></app-bar-spinner>
                  } @else {
                    Salvar alterações
                  }
                </button>
              }
            </form>

          </div>
        </app-card>

        <!-- CARD 2: CHAVE DE UTILIZADOR -->
        <app-card>
          <div content class="flex flex-col gap-3">
            <span class="text-sm text-(--secondary)/60 py-2.5" appDarkable="dark:text-(--dm-secondary)/60">Chave de Utilizador</span>
            
            <div class="flex gap-3 items-center">
              <input
              type="text"
              readonly
              [value]="maskedUserKey()"
              class="bg-[#FAFAFA] text-sm border w-full border-black/5 text-(--secondary)/60 py-1.5 px-2.5 rounded-[10px] focus:outline-none font-mono tracking-wider"
              >

              <button
              type="button"
              (click)="copyUserKey()"
              appSubmitableButton
              tailwindClassBackgroundColor="bg-(color:--primary)/63"
              tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
              class="shrink-0 text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium text-black flex items-center gap-1.5">
                @if (isCopied()) {
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.800049 6.35559L5.10774 10.8L14.8 0.800049" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Copiado!
                } @else {
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.20652 3.89358C3.20652 4.27306 3.51415 4.58068 3.89362 4.58068C4.27309 4.58068 4.58072 4.27306 4.58072 3.89358H3.20652ZM3.89362 3.68012H4.58073L4.58071 3.6763L3.89362 3.68012ZM6.8537 0.68711V0L6.84985 1.83476e-05L6.8537 0.68711ZM10.553 0.68711L10.5568 9.17379e-06H10.553V0.68711ZM13.513 3.68012L12.8259 3.6763V3.68012H13.513ZM13.513 7.31351H12.8259L12.826 7.31736L13.513 7.31351ZM10.553 10.3065V10.9936H10.5568L10.553 10.3065ZM10.3065 9.61943C9.92706 9.61943 9.61942 9.92706 9.61942 10.3065C9.61942 10.686 9.92706 10.9936 10.3065 10.9936V9.61943ZM3.89362 4.58068C4.27309 4.58068 4.58072 4.27306 3.89362 3.20648V4.58068ZM3.64718 3.89358V3.20647L3.64339 3.20649L3.64718 3.89358ZM0.687149 6.8866H1.37426L1.37424 6.88275L0.687149 6.8866ZM0.687149 10.5209L1.37425 10.5245V10.5209H0.687149ZM3.64718 13.513L3.64339 14.2001H3.64718V13.513ZM7.34649 13.513V14.2001H7.35034L7.34649 13.513ZM10.3065 10.52H9.61942L9.61951 10.5238L10.3065 10.52ZM10.9936 10.3065C10.9936 9.92706 10.6861 9.61943 10.3065 9.61943C9.92706 9.61943 9.61942 9.92706 9.61942 10.3065H10.9936ZM3.89362 3.20648C3.51415 3.20648 3.20652 3.51411 3.20652 3.89358C3.20652 4.27306 3.51415 4.58068 3.89362 4.58068V3.20648ZM7.34658 3.89358L7.35034 3.20648H7.34658V3.89358ZM10.3066 6.8866L9.61951 6.88275V6.8866H10.3066ZM9.61942 10.3065C9.61942 10.686 9.92706 10.9936 10.9936 10.9936C10.686 10.9936 10.9936 10.686 10.9936 10.3065H9.61942ZM4.58072 3.89358L4.58073 3.68012H3.20652V3.89358H4.58072ZM4.58071 3.6763C4.57734 3.06911 4.8153 2.48545 5.24231 2.05372L4.26521 1.08741C3.58195 1.77828 3.20113 2.71228 3.20653 3.68394L4.58071 3.6763ZM5.24231 2.05372C5.66923 1.62199 6.25024 1.37756 6.85746 1.3742L6.84985 1.83476e-05C5.8782 0.0053869 4.9485 0.396531 4.26521 1.08741L5.24231 2.05372ZM6.8537 1.37421H10.553V9.17379e-06L6.8537 0V1.37421ZM10.5492 1.3742C11.1564 1.37756 11.7374 1.62199 12.1644 2.05372L13.1414 1.08741C12.4582 0.396531 11.5285 0.00537772 10.5568 9.17379e-06L10.5492 1.3742ZM12.1644 2.05372C12.5914 2.48545 12.8292 3.06911 12.8259 3.6763L14.2001 3.68394C14.2055 2.71228 13.8247 1.77828 13.1414 1.08741L12.1644 2.05372ZM12.8259 3.68012V7.31351H14.2001V3.68012H12.8259ZM12.826 7.31736C12.8293 7.92449 12.5914 8.50815 12.1644 8.93993L13.1414 9.90627C13.8247 9.21532 14.2055 8.28132 14.2001 7.30967L12.826 7.31736ZM12.1644 8.93993C11.7374 9.37161 11.1564 9.61604 10.5492 9.61943L10.5568 10.9936C11.5285 10.9882 12.4582 10.5971 13.1414 9.90627L12.1644 8.93993ZM10.553 9.61943H10.3065V10.9936H10.553V9.61943ZM3.89362 3.20648L3.64718 3.20647V4.58068H3.89362V3.20648ZM3.64339 3.20649C2.67173 3.21186 1.742 3.603 1.05874 4.29388L2.03582 5.26019C2.46279 4.82846 3.04378 4.58403 3.65097 4.58068L3.64339 3.20649ZM1.05874 4.29388C0.37548 4.98476 -0.00533946 5.91879 5.65719e-05 6.89044L1.37424 6.88275C1.37087 6.27563 1.60884 5.69196 2.03582 5.26019L1.05874 4.29388ZM4.73982e-05 6.8866V10.5209H1.37425L1.37426 6.8866H4.73982e-05ZM5.65719e-05 10.5173C-0.0105614 12.5402 1.62045 14.1889 3.64339 14.2001L3.65098 12.8259C2.38684 12.8189 1.36762 11.7887 1.37425 10.5245L5.65719e-05 10.5173ZM3.64718 14.2001H7.34649V12.8259H3.64718V14.2001ZM7.35034 14.2001C8.32199 14.1947 9.25168 13.8036 9.93494 13.1127L8.95788 12.1464C8.53096 12.5781 7.94995 12.8225 7.34273 12.8259L7.35034 14.2001ZM9.93494 13.1127C10.6182 12.4218 10.999 11.4878 10.9936 10.5161L9.61951 10.5238C9.62281 11.131 9.38489 11.7146 8.95788 12.1464L9.93494 13.1127ZM10.9936 10.52V10.3065H9.61942V10.52H10.9936ZM3.89362 4.58068H7.34658V3.20648H3.89362V4.58068ZM7.34273 4.58068C7.94995 4.58403 8.53096 4.82846 8.95788 5.26019L9.93494 4.29388C9.25168 3.603 8.32199 3.21185 7.35034 3.20648L7.34273 4.58068ZM8.95788 5.26019C9.38489 5.69196 9.62281 6.27563 9.61951 6.88275L10.9936 6.89044C10.999 5.91879 10.6182 4.98476 9.93494 4.29388L8.95788 5.26019ZM9.61951 6.8866L9.61942 10.3065H10.9936L10.9937 6.8866H9.61951Z" fill="currentColor"/>
                  </svg>
                  Copiar
                }
              </button>
            </div>
          </div>
        </app-card>

      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class SettingsPage implements OnInit {
  private settingsFacade = inject(SettingsFacade);

  user = this.settingsFacade.user;
  settings = this.settingsFacade.settings;

  userInitial = computed(() => {
    const name = this.user()?.name;
    return name ? name.charAt(0).toUpperCase() : 'I';
  });

  // Options from FinanceStore and Enums
  currencyOptions = computed<SelectOption[]>(() =>
    this.settingsFacade.currencies().map(curr => ({ label: curr.code, value: curr.id }))
  );

  languageOptions: SelectOption[] = [
    { label: 'Português', value: AppLanguage.PORTUGUESE },
    { label: 'Inglês', value: AppLanguage.ENGLISH }
  ];

  themeOptions: SelectOption[] = [
    { label: 'Sistema', value: AppThemeMode.SYSTEM },
    { label: 'Claro', value: AppThemeMode.LIGHT },
    { label: 'Escuro', value: AppThemeMode.DARK }
  ];

  // Saved / Initial Values
  initialCurrency = signal<string>('');
  initialLanguage = signal<string>('');
  initialTheme = signal<string>('');

  // Form Groups
  currencyForm!: FormGroup;
  languageForm!: FormGroup;
  themeForm!: FormGroup;

  // Updating spinners
  isUpdatingCurrency = signal<boolean>(false);
  isUpdatingLanguage = signal<boolean>(false);
  isUpdatingTheme = signal<boolean>(false);

  // Copy state
  isCopied = signal<boolean>(false);

  // Raw & Masked User Key
  rawUserKey = computed(() => {
    return this.settings()?.sharingKey || this.user()?.id || '';
  });

  maskedUserKey = computed(() => {
    const key = this.rawUserKey();
    if (!key) return '';
    const visibleLength = 4;
    if (key.length <= visibleLength) return key;
    return key.substring(0, visibleLength) + '*'.repeat(key.length - visibleLength);
  });

  constructor() {
    effect(() => {
      const settings = this.settings();
      if (!settings) return;

      const curr = settings.currency_id || (this.settingsFacade.currencies()[0]?.id ?? '');
      const lang = settings.language === AppLanguage.ENGLISH ? AppLanguage.ENGLISH : AppLanguage.PORTUGUESE;
      const theme = (settings.theme === AppThemeMode.LIGHT || settings.theme === AppThemeMode.DARK || settings.theme === AppThemeMode.SYSTEM)
        ? settings.theme
        : AppThemeMode.SYSTEM;

      if (this.currencyForm && this.currencyForm.pristine) {
        this.initialCurrency.set(curr);
        this.currencyForm.get('currency')?.setValue(curr, { emitEvent: false });
      }

      if (this.languageForm && this.languageForm.pristine) {
        this.initialLanguage.set(lang);
        this.languageForm.get('language')?.setValue(lang, { emitEvent: false });
      }

      if (this.themeForm && this.themeForm.pristine) {
        this.initialTheme.set(theme);
        this.themeForm.get('theme')?.setValue(theme, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const settings = this.settings();

    const curr = settings?.currency_id || (this.settingsFacade.currencies()[0]?.id ?? '');
    const lang = settings?.language === AppLanguage.ENGLISH ? AppLanguage.ENGLISH : AppLanguage.PORTUGUESE;
    const theme = (settings?.theme === AppThemeMode.LIGHT || settings?.theme === AppThemeMode.DARK || settings?.theme === AppThemeMode.SYSTEM)
      ? settings?.theme
      : AppThemeMode.SYSTEM;

    this.initialCurrency.set(curr);
    this.initialLanguage.set(lang);
    this.initialTheme.set(theme);

    this.currencyForm = new FormGroup({
      'currency': new FormControl(curr, [Validators.required])
    });

    this.languageForm = new FormGroup({
      'language': new FormControl(lang, [Validators.required])
    });

    this.themeForm = new FormGroup({
      'theme': new FormControl(theme, [Validators.required])
    });
  }

  saveCurrency(): void {
    if (this.currencyForm.invalid) return;
    const val = this.currencyForm.get('currency')?.value;
    if (!val) return;

    this.isUpdatingCurrency.set(true);
    this.settingsFacade.updateSettings({ currency_id: val }).subscribe({
      next: () => {
        this.initialCurrency.set(val);
        this.currencyForm.markAsPristine();
        this.isUpdatingCurrency.set(false);
        PopupService.success("Moeda padrão atualizada com sucesso!");
      },
      error: () => {
        this.isUpdatingCurrency.set(false);
        PopupService.error("Erro ao atualizar moeda padrão.");
      }
    });
  }

  saveLanguage(): void {
    if (this.languageForm.invalid) return;
    const val = this.languageForm.get('language')?.value;
    if (!val) return;

    const locale = val === AppLanguage.ENGLISH ? AppLocale.EN_US : AppLocale.PT_AO;

    this.isUpdatingLanguage.set(true);
    this.settingsFacade.updateSettings({ language: val, locale }).subscribe({
      next: () => {
        this.initialLanguage.set(val);
        this.languageForm.markAsPristine();
        this.isUpdatingLanguage.set(false);
        PopupService.success("Idioma atualizado com sucesso!");
      },
      error: () => {
        this.isUpdatingLanguage.set(false);
        PopupService.error("Erro ao atualizar idioma.");
      }
    });
  }

  saveTheme(): void {
    if (this.themeForm.invalid) return;
    const val = this.themeForm.get('theme')?.value;
    if (!val) return;

    this.isUpdatingTheme.set(true);
    this.settingsFacade.updateSettings({ theme: val }).subscribe({
      next: () => {
        this.settingsFacade.setTheme(val as any);
        this.initialTheme.set(val);
        this.themeForm.markAsPristine();
        this.isUpdatingTheme.set(false);
        PopupService.success("Tema atualizado com sucesso!");
      },
      error: () => {
        this.isUpdatingTheme.set(false);
        PopupService.error("Erro ao atualizar tema.");
      }
    });
  }

  copyUserKey(): void {
    const keyToCopy = this.rawUserKey();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(keyToCopy).then(() => {
        this.triggerCopiedState();
      }).catch(() => {
        this.triggerCopiedState();
      });
    } else {
      this.triggerCopiedState();
    }
  }

  private triggerCopiedState(): void {
    this.isCopied.set(true);
    setTimeout(() => {
      this.isCopied.set(false);
    }, 2000);
  }
}
