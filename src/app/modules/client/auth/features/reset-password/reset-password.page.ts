import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MotionedHeight } from "@shared/directives/motioned-height";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { Darkable } from "@shared/directives/darkable";
import { SupabaseService } from '@core/services/supabase.service';
import { PopupService } from '@core/services/pop-up.service';
import { BarSpinnerUi } from '@shared/ui/spinner/bar-spinner.ui';

@Component({
  selector: 'app-reset-password',
  imports: [MotionedHeight, SubmitableButton, Darkable, ReactiveFormsModule, BarSpinnerUi],
  template: `
    <section
    data-aos=""
    class="panel-section limited-container flex flex-col gap-5 items-center">
      <div class="form-container w-full">
        <form [formGroup]="updatePasswordForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-5 w-full">
          <div class="motionedHeight" appMotionedHeight [RouterOutletable]="false">
            <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
              <label for="password" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Nova senha</label>
              <input
              type="password"
              id="password"
              name="password"
              autocomplete="new-password"
              formControlName="password"
              placeholder="Digite a nova senha"
              required
              class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white text-sm text-(--secondary) placeholder:text-(--secondary)/60" />
            </div>
          </div>

          <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
            <label for="confirm-password" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Confirme a senha</label>
            <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            autocomplete="new-password"
            formControlName="confirmPassword"
            placeholder="Confirme a nova senha"
            required
            class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white text-sm text-(--secondary) placeholder:text-(--secondary)/60" />
          </div>

          <div class="submit">
            <button
            type="submit"
            [disabled]="updatePasswordForm.invalid || isLoading()"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-[0.5rem] font-medium text-black flex items-center justify-center">
              @if (isLoading()) {
                <app-bar-spinner></app-bar-spinner>
              } @else {
                Redefinir a senha
              }
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: ``
})
export class ResetPasswordPage {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);

  updatePasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  async onSubmit(): Promise<void> {
    if (this.updatePasswordForm.invalid) return;

    const { password, confirmPassword } = this.updatePasswordForm.value;
    if (password !== confirmPassword) {
      PopupService.error('As palavras-passes não coincidem.');
      return;
    }

    if (!password) return;

    this.isLoading.set(true);
    try {
      const { error } = await this.supabaseService.updatePassword(password);
      if (error) {
        PopupService.error(error.message || 'Erro ao atualizar a palavra-passe.');
      } else {
        PopupService.success('Palavra-passe atualizada com sucesso!');
        this.router.navigate(['/auth/sign-in']);
      }
    } catch (err: any) {
      PopupService.error('Erro de comunicação ao redefinir a senha.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
