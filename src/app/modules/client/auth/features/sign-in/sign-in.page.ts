import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SubmitableButton } from "@shared/directives/submitable-button";
import { MotionedHeight } from "@shared/directives/motioned-height";
import { Darkable } from "@shared/directives/darkable";
import { SupabaseService } from '@core/services/supabase.service';
import { PopupService } from '@core/services/pop-up.service';
import { BarSpinnerUi } from '@shared/ui/spinner/bar-spinner.ui';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, SubmitableButton, MotionedHeight, Darkable, ReactiveFormsModule, BarSpinnerUi],
  template: `
    <section
    data-aos=""
    class="panel-section limited-container flex flex-col gap-5 items-center">
      <div class="invite-text max-w-[17.313rem]">
        <p class="text-sm text-(color:--secondary) text-center"
        appDarkable="dark:text-(color:--dm-secondary)"
        >
          Acesse sua conta e acompanhe seus valores com clareza
        </p>
      </div>
      
      <div class="form-container w-full">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-5 w-full">
          <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
            <label for="email" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Email</label>
            <input
            type="email"
            id="email"
            name="email"
            autocomplete="username"
            formControlName="email"
            placeholder="Digite o seu e-mail"
            required
            class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white text-sm text-(--secondary) placeholder:text-(--secondary)/60" />
          </div>

          <div class="motionedHeight" appMotionedHeight [RouterOutletable]="false">
            <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
              <label for="password" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Senha</label>
              <input
              type="password"
              id="password"
              name="password"
              autocomplete="current-password"
              formControlName="password"
              placeholder="Digite a sua senha"
              required
              class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white text-sm text-(--secondary) placeholder:text-(--secondary)/60" />
              <div class="forgot-content text-right">
                <a [routerLink]="['/auth/forgot-password']" class="text-[#3586FF] text-sm">Esqueceu a senha?</a>
              </div>
            </div>
          </div>

          <div class="submit">
            <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-[0.5rem] font-medium text-black flex items-center justify-center">
              @if (isLoading()) {
                <app-bar-spinner></app-bar-spinner>
              } @else {
                Entrar na minha conta
              }
            </button>
          </div>
        </form>
      </div>

      <div class="signup-and-otp-auth w-full flex flex-col gap-4">
        <p class="text-sm text-(color:--secondary) text-center" appDarkable="dark:text-(color:--dm-secondary)">
          Não tem uma conta ainda? <a [routerLink]="['/auth/sign-up']" class="text-[#3586FF]">Crie uma</a>
        </p>

        <div class="option-line relative w-full text-center after:absolute after:z-[1] after:bg-[#E3E3E3]/50 after:h-[0.063rem] after:top-[50%] after:translate-y-[-50%] after:w-full after:left-0">
          <span class="text-[#DDDDDD] !z-[2] relative px-3 text-center bg-white" appDarkable="dark:bg-(color:--dm-bg)">OU</span>
        </div>

        <div class="otp-auth-button">
          <button
          type="button"
          (click)="loginWithGoogle()"
          [disabled]="isGoogleLoading()"
          class="w-full text-sm text-(color:--secondary) border flex gap-4 justify-center items-center border-(color:--secondary)/10 dark:border-(color:--dm-secondary)/10 rounded-[0.563rem] px-2 py-[0.5rem] cursor-pointer"
          appDarkable="dark:text-(color:--dm-secondary)"
          >
            @if (isGoogleLoading()) {
              <app-bar-spinner></app-bar-spinner>
            } @else {
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.39777 8.5C4.39777 7.95527 4.48824 7.43304 4.64972 6.94321L1.82335 4.78491C1.27251 5.90333 0.962158 7.16354 0.962158 8.5C0.962158 9.83531 1.27213 11.0948 1.82221 12.2124L4.64705 10.0499C4.4871 9.56237 4.39777 9.04205 4.39777 8.5Z" fill="#FBBC05"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.35998 3.54455C10.5434 3.54455 11.6122 3.96386 12.452 4.65L14.8951 2.21038C13.4064 0.914331 11.4977 0.113831 9.35998 0.113831C6.04117 0.113831 3.18885 2.01178 1.823 4.78494L4.64936 6.94324C5.3006 4.96639 7.15698 3.54455 9.35998 3.54455Z" fill="#EB4335"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.35997 13.4555C7.15698 13.4555 5.3006 12.0337 4.64936 10.0568L1.823 12.2147C3.18885 14.9883 6.04117 16.8862 9.35997 16.8862C11.4084 16.8862 13.364 16.1589 14.8318 14.7962L12.1489 12.7221C11.392 13.199 10.4388 13.4555 9.35997 13.4555Z" fill="#34A853"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3765 8.50004C17.3765 8.0045 17.3002 7.47083 17.1857 6.97528H9.36011V10.2154H13.8646C13.6394 11.3201 13.0263 12.1694 12.1491 12.7221L14.8319 14.7962C16.3737 13.3652 17.3765 11.2336 17.3765 8.50004Z" fill="#4285F4"/>
              </svg>
              Entre com o Google
            }
          </button>
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class SignInPage {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  isGoogleLoading = signal<boolean>(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    this.isLoading.set(true);
    try {
      const { error } = await this.supabaseService.signInWithPassword(email, password);
      if (error) {
        PopupService.error(error.message || 'Erro ao efetuar login. Verifique as suas credenciais.');
      } else {
        PopupService.success('Login efetuado com sucesso!');
        this.router.navigate(['/secure/dashboard']);
      }
    } catch (err: any) {
      PopupService.error('Ocorreu um erro inesperado ao conectar ao servidor.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.isGoogleLoading.set(true);
    try {
      const { error } = await this.supabaseService.signInWithGoogle();
      if (error) {
        PopupService.error(error.message || 'Erro ao autenticar com o Google.');
        this.isGoogleLoading.set(false);
      }
    } catch (err: any) {
      PopupService.error('Erro ao conectar ao serviço de autenticação.');
      this.isGoogleLoading.set(false);
    }
  }
}
