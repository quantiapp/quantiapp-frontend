import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SubmitableButton } from "@shared/directives/submitable-button";
import { Darkable } from "@shared/directives/darkable";
import { SupabaseService } from '@core/services/supabase.service';
import { PopupService } from '@core/services/pop-up.service';
import { BarSpinnerUi } from '@shared/ui/spinner/bar-spinner.ui';

@Component({
  selector: 'app-request-password-reset',
  imports: [RouterLink, SubmitableButton, Darkable, ReactiveFormsModule, BarSpinnerUi],
  template: `
    <section
    data-aos=""
    class="panel-section limited-container flex flex-col gap-5 items-center">
      <div class="invite-text max-w-[17.875rem]">
        <p class="text-sm text-(color:--secondary) text-center" appDarkable="dark:text-(color:--dm-secondary)">
          Informe o e-mail usado no cadastro e nós lhe enviaremos o passo a passo para redefinir sua senha
        </p>
      </div>

      <div class="form-container w-full">
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-5 w-full">
          <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
            <label for="email" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Email</label>
            <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Digite o seu e-mail"
            required
            class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white text-sm text-(--secondary) placeholder:text-(--secondary)/60" />
          </div>

          <div class="submit">
            <button
            type="submit"
            [disabled]="resetForm.invalid || isLoading()"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-[0.5rem] font-medium text-black flex items-center justify-center">
              @if (isLoading()) {
                <app-bar-spinner></app-bar-spinner>
              } @else {
                Solicitar redefinição
              }
            </button>
          </div>
        </form>
      </div>

      <div class="signin w-full flex flex-col gap-4">
        <p class="text-sm text-(color:--secondary) text-center" appDarkable="dark:text-(color:--dm-secondary)">
          Já não precisa redefinir? <a [routerLink]="['/auth/sign-in']" class="text-[#3586FF]">Entre por aqui</a>
        </p>
      </div>
    </section>
  `,
  styles: ``
})
export class RequestPasswordResetPage {
  private supabaseService = inject(SupabaseService);

  isLoading = signal<boolean>(false);

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  async onSubmit(): Promise<void> {
    if (this.resetForm.invalid) return;

    const email = this.resetForm.get('email')?.value;
    if (!email) return;

    this.isLoading.set(true);
    try {
      const { error } = await this.supabaseService.resetPasswordForEmail(email);
      if (error) {
        PopupService.error(error.message || 'Erro ao solicitar redefinição de palavra-passe.');
      } else {
        PopupService.success('Email de redefinição enviado com sucesso! Verifique a sua caixa de entrada.');
      }
    } catch (err: any) {
      PopupService.error('Erro de conexão ao solicitar redefinição.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
