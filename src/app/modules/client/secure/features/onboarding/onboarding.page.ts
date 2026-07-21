import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Darkable } from '@shared/directives/darkable';
import { SubmitableButton } from '@shared/directives/submitable-button';
import { CardTemplate } from '@client/secure/ui/card.template';
import { BarSpinnerUi } from '@shared/ui/spinner/bar-spinner.ui';
import { PopupService } from '@core/services/pop-up.service';
import { SettingsFacade } from '../settings/settings.facade';
import { AccountFacade } from '../accounts/account.facade';
import { FinanceStore } from '@core/data/finance-store.data';
import { AccountTypeService } from '@core/services/account-type.service';
import { CurrencyService } from '@core/services/currency.service';
import { CreateAccountDTO } from '@core/dtos/account.dto';
import { SelectComponent, SelectOption } from '@shared/components/forms/select.component';
import { IconContainerContainer } from '@shared/ui/icon/icon-container.container';
import { Currency } from '@core/models/currency.model';
import { AccountType } from '@core/models/account-type.model';
import { getCurrencySymbol } from '@angular/common';
import { catchError, finalize, forkJoin, Observable, of, tap } from 'rxjs';
import { AppLanguage, AppLocale, AppThemeMode } from '@core/enums/user-setting.enum';

export interface OnboardingCurrencyOption {
  label: string;
  value: string;
  name: string;
  symbol: string;
}

@Component({
  selector: 'app-onboarding-page',
  imports: [
    ReactiveFormsModule,
    Darkable,
    SubmitableButton,
    CardTemplate,
    BarSpinnerUi,
    SelectComponent,
    IconContainerContainer
  ],
  template: `
    <div class="min-h-screen py-10 px-4 flex flex-col justify-center items-center limited-container">
      
      <!-- HEADER & WELCOME LOGO -->
      <div class="flex flex-col items-center gap-3 mb-8 text-center">
        <div class="w-14 h-14 rounded-full overflow-hidden">
          <img src="/static/primary-brand.svg" class="w-full h-full object-cover" alt="Quantiapp logo">
        </div>
        <h1 class="text-2xl font-bold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Bem-vindo à QuantiAPP!</h1>
        <p class="text-sm text-(--secondary)/60 max-w-sm" appDarkable="dark:text-(--dm-secondary)/60">
          Vamos configurar as suas preferências iniciais para personalizar a sua experiência.
        </p>
      </div>

      <!-- PROGRESS STEPPER -->
      <div class="w-full max-w-md flex items-center justify-between mb-8 px-4">
        @for (s of [1, 2, 3, 4]; track s) {
          <div class="flex items-center">
            <div 
              class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
              [class]="currentStep() === s ? 'bg-(color:--primary) text-black shadow-md' : (currentStep() > s ? 'bg-blue-500 text-white' : 'bg-black/5 dark:bg-white/10 text-(--secondary)/60')"
              appDarkable="dark:text-(--dm-secondary)"
            >
              @if (currentStep() > s) {
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 3.83333L3.125 5.95833C3.51614 6.34948 4.15052 6.34948 4.54167 5.95833L9.5 1" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              } @else {
                {{ s }}
              }
            </div>
            @if (s < 4) {
              <div 
                class="h-1 w-12 sm:w-16 mx-1 sm:mx-2 rounded transition-all duration-300"
                [class]="currentStep() > s ? 'bg-blue-500' : 'bg-black/5 dark:bg-white/10'"
              ></div>
            }
          </div>
        }
      </div>

      <!-- MAIN ONBOARDING CARD -->
      <div class="w-full max-w-md">
        
        <!-- STEP 1: MOEDA PADRÃO -->
        @if (currentStep() === 1) {
          <app-card>
            <ng-container header>
              <h2 class="text-lg font-bold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">1. Escolha a sua Moeda Padrão</h2>
            </ng-container>
            <ng-container content>
              <div class="flex flex-col gap-4 py-2">
                <p class="text-xs text-(--secondary)/60 leading-relaxed" appDarkable="dark:text-(--dm-secondary)/60">
                  Esta moeda será utilizada para calcular o seu saldo total consolidado e exibir os resumos financeiros.
                </p>

                <div class="grid grid-cols-1 gap-3">
                  @if (isLoadingData()) {
                    <div class="flex justify-center items-center py-8">
                      <app-bar-spinner></app-bar-spinner>
                    </div>
                  } @else {
                    @for (c of currencies(); track c.value) {
                      <button
                        type="button"
                        (click)="selectedCurrency.set(c.value)"
                        class="p-4 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer"
                        [class]="selectedCurrency() === c.value ? 'border-(color:--primary) bg-(color:--primary)/10 shadow-sm' : 'border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5'"
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-sm text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">
                            {{ c.label }}
                          </div>
                          <div class="text-left">
                            <p class="text-sm font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">{{ c.label }}</p>
                            <p class="text-xs text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ c.name }} ({{ c.symbol }})</p>
                          </div>
                        </div>
                        @if (selectedCurrency() === c.value) {
                          <div class="w-6 h-6 rounded-full bg-(color:--primary) flex items-center justify-center">
                            <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 3.83333L3.125 5.95833C3.51614 6.34948 4.15052 6.34948 4.54167 5.95833L9.5 1" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                        }
                      </button>
                    }
                  }
                </div>
              </div>
            </ng-container>
            <ng-container foot>
              <div class="flex justify-between items-center w-full pt-4 border-t border-black/5 dark:border-white/5">
                <div></div>
                <button
                  type="button"
                  (click)="nextStep()"
                  [disabled]="isLoadingData() || currencies().length === 0"
                  appSubmitableButton
                  tailwindClassBackgroundColor="bg-(color:--primary)"
                  tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                  class="px-5 py-1.5 text-sm font-semibold text-black rounded-lg disabled:opacity-50 flex items-center justify-center min-w-[90px]"
                >
                  @if (isLoadingData()) {
                    <app-bar-spinner></app-bar-spinner>
                  } @else {
                    Próximo
                  }
                </button>
              </div>
            </ng-container>
          </app-card>
        }

        <!-- STEP 2: IDIOMA -->
        @if (currentStep() === 2) {
          <app-card>
            <ng-container header>
              <h2 class="text-lg font-bold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">2. Idioma da Interface</h2>
            </ng-container>
            <ng-container content>
              <div class="flex flex-col gap-4 py-2">
                <p class="text-xs text-(--secondary)/60 leading-relaxed" appDarkable="dark:text-(--dm-secondary)/60">
                  Selecione o idioma em que deseja visualizar os menus e relatórios.
                </p>

                <div class="grid grid-cols-1 gap-3">
                  @for (l of languageOptions; track l.value) {
                    <button
                      type="button"
                      [disabled]="l.disabled"
                      (click)="!l.disabled && selectedLanguage.set(l.value)"
                      class="p-4 rounded-xl border flex items-center justify-between transition-all duration-200"
                      [class]="l.disabled ? 'opacity-50 cursor-not-allowed border-black/5 dark:border-white/5 bg-white/30 dark:bg-white/5' : (selectedLanguage() === l.value ? 'border-(color:--primary) bg-(color:--primary)/10 shadow-sm cursor-pointer' : 'border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5 cursor-pointer')"
                    >
                      <div class="flex items-center gap-3">
                        <span class="text-xl">{{ l.flag }}</span>
                        <p class="text-sm font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">{{ l.label }}</p>
                        @if (l.badge) {
                          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-(--secondary)/70" appDarkable="dark:text-(--dm-secondary)/70">
                            {{ l.badge }}
                          </span>
                        }
                      </div>
                      @if (selectedLanguage() === l.value && !l.disabled) {
                        <div class="w-6 h-6 rounded-full bg-(color:--primary) flex items-center justify-center">
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 3.83333L3.125 5.95833C3.51614 6.34948 4.15052 6.34948 4.54167 5.95833L9.5 1" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      }
                    </button>
                  }
                </div>
              </div>
            </ng-container>
            <ng-container foot>
              <div class="flex justify-between items-center w-full pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  (click)="prevStep()"
                  class="px-4 py-1.5 text-sm font-medium text-(--secondary) border border-black/10 dark:border-white/10 rounded-lg"
                  appDarkable="dark:text-(--dm-secondary)"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  (click)="nextStep()"
                  appSubmitableButton
                  tailwindClassBackgroundColor="bg-(color:--primary)"
                  tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                  class="px-5 py-1.5 text-sm font-semibold text-black rounded-lg min-w-[90px]"
                >
                  Próximo
                </button>
              </div>
            </ng-container>
          </app-card>
        }

        <!-- STEP 3: TEMA VISUAL -->
        @if (currentStep() === 3) {
          <app-card>
            <ng-container header>
              <h2 class="text-lg font-bold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">3. Aparência & Tema</h2>
            </ng-container>
            <ng-container content>
              <div class="flex flex-col gap-4 py-2">
                <p class="text-xs text-(--secondary)/60 leading-relaxed" appDarkable="dark:text-(--dm-secondary)/60">
                  Escolha o tema visual que mais combina com o seu estilo de navegação.
                </p>

                <div class="grid grid-cols-3 gap-3">
                  @for (t of themeOptions; track t.value) {
                    <button
                      type="button"
                      (click)="selectedTheme.set(t.value)"
                      class="p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer"
                      [class]="selectedTheme() === t.value ? 'border-(color:--primary) bg-(color:--primary)/10 shadow-sm' : 'border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5'"
                    >
                      <span class="text-2xl">{{ t.icon }}</span>
                      <p class="text-xs font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">{{ t.label }}</p>
                    </button>
                  }
                </div>
              </div>
            </ng-container>
            <ng-container foot>
              <div class="flex justify-between items-center w-full pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  (click)="prevStep()"
                  class="px-4 py-1.5 text-sm font-medium text-(--secondary) border border-black/10 dark:border-white/10 rounded-lg"
                  appDarkable="dark:text-(--dm-secondary)"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  (click)="nextStep()"
                  appSubmitableButton
                  tailwindClassBackgroundColor="bg-(color:--primary)"
                  tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                  class="px-5 py-1.5 text-sm font-semibold text-black rounded-lg min-w-[90px]"
                >
                  Próximo
                </button>
              </div>
            </ng-container>
          </app-card>
        }

        <!-- STEP 4: PRIMEIRA CONTA -->
        @if (currentStep() === 4) {
          <app-card>
            <ng-container header>
              <h2 class="text-lg font-bold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">4. Criar Primeira Conta</h2>
            </ng-container>
            <ng-container content>
              <div class="flex flex-col gap-4 py-2" [formGroup]="accountForm">
                <p class="text-xs text-(--secondary)/60 leading-relaxed" appDarkable="dark:text-(--dm-secondary)/60">
                  Crie a sua carteira ou conta principal para começar logo a acompanhar o seu saldo.
                </p>

                <div class="flex flex-col gap-3">
                  <div class="flex flex-col gap-1.5">
                    <label for="account_name" class="text-xs font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Nome da conta</label>
                    <input
                      type="text"
                      id="account_name"
                      formControlName="accountName"
                      placeholder="Ex: Carteira Pessoal, Banco BAI..."
                      class="bg-[#FAFAFA] text-sm border border-black/5 text-(--secondary) placeholder:text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label for="account_type" class="text-xs font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Tipo de conta</label>
                    <q-select
                      [appearence]="['w-full']"
                      [dropdownAppearence]="['!w-full']"
                      id="account_type"
                      [options]="accountTypes()"
                      formControlName="accountType"
                    >
                      <ng-template #option let-option>
                        <div style="display: flex; align-items: center; gap: 8px">
                          @if (option.icon) {
                            <app-icon-container [key]="option.icon"></app-icon-container>
                          }
                          <span>{{ option.label }}</span>
                        </div>
                      </ng-template>
                    </q-select>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label for="account_currency" class="text-xs font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Moeda da conta</label>
                    <q-select
                      [appearence]="['w-full']"
                      [dropdownAppearence]="['!w-full']"
                      id="account_currency"
                      [options]="selectCurrencies()"
                      formControlName="accountCurrency"
                    >
                      <ng-template #option let-option>
                        <div style="display: flex; align-items: center; gap: 8px">
                          <span>{{ option.label }}</span>
                        </div>
                      </ng-template>
                    </q-select>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label for="account_color" class="text-xs font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Cor de destaque</label>
                    <input
                      type="color"
                      id="account_color"
                      formControlName="accountColor"
                      class="bg-[#FAFAFA] text-sm border h-10 border-black/5 w-full text-(--secondary)/60 py-2.5 px-4 rounded-[10px] focus:outline-(--primary)"
                    />
                  </div>
                </div>
              </div>
            </ng-container>
            <ng-container foot>
              <div class="flex justify-between items-center w-full pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  (click)="prevStep()"
                  class="px-4 py-1.5 text-sm font-medium text-(--secondary) border border-black/10 dark:border-white/10 rounded-lg"
                  appDarkable="dark:text-(--dm-secondary)"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  (click)="finishOnboarding()"
                  [disabled]="isSubmitting() || isLoadingData() || accountForm.invalid"
                  appSubmitableButton
                  tailwindClassBackgroundColor="bg-(color:--primary)"
                  tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                  class="px-5 py-1.5 text-sm font-semibold text-black rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 min-w-[90px]"
                >
                  @if (isSubmitting() || isLoadingData()) {
                    <app-bar-spinner></app-bar-spinner>
                  } @else {
                    Concluir
                  }
                </button>
              </div>
            </ng-container>
          </app-card>
        }

      </div>

    </div>
  `,
  styles: `
    #account_color::-webkit-color-swatch-wrapper, #acc_color::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    #account_color::-webkit-color-swatch, #acc_color::-webkit-color-swatch {
      border: none;
      border-radius: 5px;
      width: 100%;
    }
    :host {
      display: block;
    }
  `
})
export class OnboardingPage implements OnInit {
  private settingsFacade = inject(SettingsFacade);
  private accountFacade = inject(AccountFacade);
  private financeStore = inject(FinanceStore);
  private accountTypeService = inject(AccountTypeService);
  private currencyService = inject(CurrencyService);
  private router = inject(Router);

  currentStep = signal<number>(1);
  isSubmitting = signal<boolean>(false);
  isLoadingData = signal<boolean>(false);

  selectedCurrency = signal<string>('curr_aoa');
  selectedLanguage = signal<string>('Português');
  selectedTheme = signal<string>('Claro');

  currencies: Signal<OnboardingCurrencyOption[]> = computed(() => {
    const list: Currency[] = this.financeStore.currencies() || [];
    return list.map(c => ({
      label: c.code,
      value: c.id,
      name: c.name || c.code,
      symbol: this.getCurrencySymbol(c.code)
    }));
  });

  selectCurrencies: Signal<SelectOption[]> = computed(() => {
    const list: Currency[] = this.financeStore.currencies() || [];
    return list.map(c => ({ label: c.code, value: c.id }));
  });

  accountTypes: Signal<SelectOption[]> = computed(() => {
    const list: AccountType[] = this.financeStore.accountTypes() || [];
    return list.map(t => ({ label: t.description, value: t.id, icon: t.icon_key }));
  });

  languageOptions = [
    { label: 'Português', value: 'Português', flag: '🇦🇴', disabled: false },
    { label: 'English', value: 'English', flag: '🇺🇸', disabled: true, badge: 'Brevemente' }
  ];

  themeOptions = [
    { label: 'Claro', value: 'Claro', icon: '☀️' },
    { label: 'Escuro', value: 'Escuro', icon: '🌙' },
    { label: 'Sistema', value: 'Sistema', icon: '💻' }
  ];

  accountForm = new FormGroup({
    accountName: new FormControl('Carteira Principal', [Validators.required]),
    accountType: new FormControl('', [Validators.required]),
    accountCurrency: new FormControl('', [Validators.required]),
    accountColor: new FormControl('#F1C40F', [Validators.required])
  });

  ngOnInit(): void {
    const hasNoAccountTypes = this.financeStore.accountTypes().length === 0;
    const hasNoCurrencies = this.financeStore.currencies().length === 0;

    if (hasNoAccountTypes || hasNoCurrencies) {
      this.isLoadingData.set(true);

      const reqs: Observable<any>[] = [];
      if (hasNoAccountTypes) {
        reqs.push(this.accountTypeService.getAll().pipe(
          tap(types => this.financeStore.loadAccountTypes(types)),
          catchError(() => of([]))
        ));
      }
      if (hasNoCurrencies) {
        reqs.push(this.currencyService.getAll().pipe(
          tap(currencies => this.financeStore.loadCurrencies(currencies)),
          catchError(() => of([]))
        ));
      }

      forkJoin(reqs).pipe(
        finalize(() => {
          this.isLoadingData.set(false);
          this.initFormDefaults();
        })
      ).subscribe();
    } else {
      this.initFormDefaults();
    }
  }

  private initFormDefaults(): void {
    const types = this.financeStore.accountTypes();
    if (types.length > 0 && !this.accountForm.get('accountType')?.value) {
      this.accountForm.patchValue({ accountType: types[0].id });
    }
    const currencies = this.financeStore.currencies();
    const aoa = currencies.find(c => c.code === 'AOA') || currencies[0];
    if (aoa) {
      this.selectedCurrency.set(aoa.id);
      this.accountForm.patchValue({ accountCurrency: aoa.id });
    }
  }

  getCurrencySymbol(code: string): string {
    if (!code) return '';
    try {
      return getCurrencySymbol(code.toUpperCase(), 'wide') || code;
    } catch {
      return code;
    }
  }

  nextStep(): void {
    if (this.currentStep() < 4) {
      // Sincroniza a moeda escolhida no Passo 1 com o formulário de conta no Passo 4
      this.accountForm.patchValue({ accountCurrency: this.selectedCurrency() });
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  finishOnboarding(): void {
    if (this.accountForm.invalid) return;

    this.isSubmitting.set(true);

    const curr = this.selectedCurrency();
    const rawLang = this.selectedLanguage();
    const rawTheme = this.selectedTheme();

    // Mapeamento via Enums para a API:
    const apiLanguage = rawLang === 'English' ? AppLanguage.ENGLISH : AppLanguage.PORTUGUESE;
    const apiLocale = rawLang === 'English' ? AppLocale.EN_US : AppLocale.PT_AO;

    let apiTheme: AppThemeMode = AppThemeMode.LIGHT;
    if (rawTheme === 'Escuro') apiTheme = AppThemeMode.DARK;
    else if (rawTheme === 'Sistema') apiTheme = AppThemeMode.SYSTEM;

    const accName = this.accountForm.get('accountName')?.value;
    const accType = this.accountForm.get('accountType')?.value;
    const accCurrency = this.accountForm.get('accountCurrency')?.value || curr;
    const accColor = this.accountForm.get('accountColor')?.value || '#F1C40F';

    // 1. O envio ao backend é feito PRIMEIRO com o payload JSON especificado:
    // { "language": "PT", "theme": "system", "locale": "pt-AO", "currency_id": "..." }
    this.settingsFacade.updateSettings({
      currency_id: curr,
      language: apiLanguage,
      locale: apiLocale,
      theme: apiTheme
    }).subscribe({
      next: () => {
        // SOMENTE APÓS RESPOSTA COM SUCESSO DO BACKEND:
        // A) Atualizar o tema no localStorage / ThemeService
        this.settingsFacade.setTheme(apiTheme as any);

        // B) Criar a primeira conta usando exatamente o mesmo DTO e fluxo de CreateAccountComponent
        if (accName && accType) {
          const accountDto = new CreateAccountDTO(
            accName,
            accType,
            0,
            accColor,
            accCurrency,
            false
          );

          this.accountFacade.create(accountDto).subscribe({
            next: () => this.completeAndRedirect(),
            error: () => this.completeAndRedirect()
          });
        } else {
          this.completeAndRedirect();
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        PopupService.error("Erro ao salvar configurações iniciais no servidor.");
      }
    });
  }

  private completeAndRedirect(): void {
    this.isSubmitting.set(false);
    PopupService.success("Configuração concluída com sucesso! Bem-vindo!");
    this.router.navigate(['/secure/dashboard']);
  }
}
