import { Component, inject, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { PlanService } from '@core/services/plan.service';
import { UserService } from '@core/services/user.service';
import { UserStore } from '@core/data/user-store.data';
import { FinanceStore } from '@core/data/finance-store.data';
import { SubmitableButton } from '@shared/directives/submitable-button';
import { IconContainerContainer } from '@shared/ui/icon/icon-container.container';
import { BarSpinnerUi } from '@shared/ui/spinner/bar-spinner.ui';
import { PopupService } from '@core/services/pop-up.service';
import { Darkable } from '@shared/directives/darkable';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency-pipe';
import { ToggleComponent } from '@shared/components/forms/toggle.component';
import { NgxMaskDirective } from 'ngx-mask';
import { environment } from '@environments/environment';

export interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  currency: string;
  accounts_limit: number | null;
  goals_limit_by_account: number | null;
  can_share_accounts: boolean;
  has_offline_mode: boolean;
}

@Component({
  selector: 'app-upgrade-plans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SubmitableButton, IconContainerContainer, BarSpinnerUi, Darkable, CustomCurrencyPipe, ToggleComponent, NgxMaskDirective],
  templateUrl: './upgrade-plans.component.html',
  styleUrls: ['./upgrade-plans.component.css']
})
export class UpgradePlansComponent implements OnInit {
  private planService = inject(PlanService);
  private userService = inject(UserService);
  public userStore = inject(UserStore);
  public financeStore = inject(FinanceStore);

  onSuccess = output<void>();

  plans = signal<Plan[]>([]);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  billingCycle = signal<'monthly' | 'annual'>('monthly'); // 'monthly' | 'annual'

  protected readonly environment = environment;

  activateTrial(): void {
    this.userStore.activateTrial();
    const days = this.environment.trialDays || 30;
    PopupService.success(`Trial de ${days} dias ativado com sucesso!`);
    this.onSuccess.emit();
  }

  getRemainingTrialDays(): number {
    return this.userStore.getRemainingTrialDays();
  }

  onBillingCycleToggle(isAnnual: boolean): void {
    this.billingCycle.set(isAnnual ? 'annual' : 'monthly');
  }

  convertPlanPrice(price: number, planCurrencyCode: string): number {
    const userCurrencyId = this.userStore.settings()?.currency_id;
    if (!userCurrencyId) return price;

    const currencyMap = this.financeStore.currenciesMap();
    const userCurrency = currencyMap[userCurrencyId];
    if (!userCurrency) return price;

    const currencies = this.financeStore.currencies();
    const planCurrency = currencies.find(c => c.code.toUpperCase() === planCurrencyCode.toUpperCase());
    if (!planCurrency) return price;

    const valueInBaseCurrency = price / planCurrency.rate_to_base;
    return valueInBaseCurrency * userCurrency.rate_to_base;
  }

  getUserCurrencyCode(): string {
    const userCurrencyId = this.userStore.settings()?.currency_id;
    if (!userCurrencyId) return 'EUR';
    return this.financeStore.currenciesMap()[userCurrencyId]?.code || 'EUR';
  }

  // Payment states
  selectedPlan = signal<Plan | null>(null);
  paymentStep = signal<'plans' | 'payment' | 'processing' | 'success'>('plans');
  paymentMethod = signal<'card' | 'mbway'>('card');
  cardFlipped = signal<boolean>(false);

  // Form Controls
  paymentForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
    cardName: new FormControl('', [Validators.required]),
    cardExpiry: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]),
    cardCvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}$/)]),
    mbwayPhone: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)])
  });

  ngOnInit(): void {
    this.planService.getAvailablePlans().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.plans.set(res.data);
        } else if (Array.isArray(res)) {
          this.plans.set(res);
        }
        this.isLoading.set(false);
      },
      error: () => {
        // Fallback plans if API fails
        this.plans.set([
          {
            id: '019f86d8-5f65-7236-adfb-00fc18a73b07',
            name: 'Free',
            price_monthly: 0.0,
            currency: 'EUR',
            accounts_limit: 3,
            goals_limit_by_account: 3,
            can_share_accounts: false,
            has_offline_mode: false
          },
          {
            id: '019f86d8-5f65-7236-adfb-00fc18a73b08',
            name: 'Pro Premium',
            price_monthly: 4.99,
            currency: 'EUR',
            accounts_limit: null,
            goals_limit_by_account: null,
            can_share_accounts: true,
            has_offline_mode: true
          }
        ]);
        this.isLoading.set(false);
      }
    });
  }

  isCurrentPlan(plan: Plan): boolean {
    const active = this.userStore.planLimits()?.plan_name || 'Free';
    // Match names normalized
    return active.toLowerCase().includes(plan.name.toLowerCase()) || plan.name.toLowerCase().includes(active.toLowerCase());
  }

  getYearlyPrice(price: number): number {
    // 20% discount on 12 months (price * 12 * 0.8)
    return parseFloat((price * 12 * 0.8).toFixed(2));
  }

  selectPlan(plan: Plan): void {
    if (this.isCurrentPlan(plan)) return;

    if (plan.price_monthly === 0) {
      // Free plan requires no payment details
      this.selectedPlan.set(plan);
      this.confirmSubscription();
    } else {
      this.selectedPlan.set(plan);
      this.paymentStep.set('payment');
    }
  }

  backToPlans(): void {
    this.paymentStep.set('plans');
    this.selectedPlan.set(null);
  }

  setPaymentMethod(method: 'card' | 'mbway'): void {
    this.paymentMethod.set(method);
    if (method === 'mbway') {
      this.paymentForm.get('mbwayPhone')?.setValidators([Validators.required, Validators.pattern(/^\d{9}$/)]);
      this.paymentForm.get('cardNumber')?.clearValidators();
      this.paymentForm.get('cardName')?.clearValidators();
      this.paymentForm.get('cardExpiry')?.clearValidators();
      this.paymentForm.get('cardCvv')?.clearValidators();
    } else {
      this.paymentForm.get('mbwayPhone')?.clearValidators();
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm.get('cardName')?.setValidators([Validators.required]);
      this.paymentForm.get('cardExpiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.paymentForm.get('cardCvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
    }
    this.paymentForm.updateValueAndValidity();
  }

  submitPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.confirmSubscription();
  }

  private confirmSubscription(): void {
    const plan = this.selectedPlan();
    if (!plan) return;

    this.paymentStep.set('processing');
    this.isSubmitting.set(true);

    // Simulate bank authorization processing delay
    setTimeout(() => {
      this.planService.subscribeToPlan(plan.id).subscribe({
        next: () => {
          this.paymentStep.set('success');
          this.isSubmitting.set(false);
          // Reload user profile to refresh plan limits
          this.userService.getUser().subscribe();
          
          setTimeout(() => {
            PopupService.success(`Plano atualizado para ${plan.name}!`);
            this.onSuccess.emit();
          }, 2000);
        },
        error: (err) => {
          // If api fails but we want to allow mock testing on standalone deployments
          console.warn('API Upgrade failed, executing local fallback upgrade: ', err);
          
          // Local fallback simulation
          const mockLimits = {
            plan_name: plan.name,
            max_accounts: plan.accounts_limit === null ? -1 : plan.accounts_limit,
            max_goals_per_account: plan.goals_limit_by_account === null ? -1 : plan.goals_limit_by_account,
            max_shares: plan.can_share_accounts ? -1 : 0,
            has_offline_mode: plan.has_offline_mode
          };
          this.userStore.setPlanLimits(mockLimits);
          
          // Force update local user mock profile
          const updatedUser = this.userStore.user();
          if (updatedUser) {
            this.userStore.loadUser({
              ...updatedUser,
              plan_limits: mockLimits
            });
          }

          this.paymentStep.set('success');
          this.isSubmitting.set(false);

          setTimeout(() => {
            PopupService.success(`Plano atualizado para ${plan.name} (Simulação)!`);
            this.onSuccess.emit();
          }, 2000);
        }
      });
    }, 2500);
  }
}
