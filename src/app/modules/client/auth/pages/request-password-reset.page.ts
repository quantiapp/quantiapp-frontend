import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubmitableButton } from "@shared/directives/submitable-button";

@Component({
  selector: 'app-request-password-reset',
  imports: [RouterLink, SubmitableButton],
  template: `
    <section
    data-aos=""
    class="panel-section limited-container flex flex-col gap-5 items-center">
      <div class="invite-text max-w-[286px]">
        <p class="text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition text-center">
          Informe o e-mail usado no cadastro e nós lhe enviaremos o passo a passo para redefinir sua senha
        </p>
      </div>
      <div class="form-container w-full">
        <form class="flex flex-col gap-5 w-full">
          <div class="input-wrapper w-full flex flex-col gap-[10px]">
            <label for="email" class="text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition">Email</label>
            <input type="email" id="email" placeholder="" required autocomplete=""
            class="focus:outline-none border border-black/5 rounded-[10px] px-4 py-[10px] bg-white" />
          </div>
          <div class="submit">
            <button appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-full text-sm border border-[#C29B00] rounded-[9px] px-2 py-[8px] font-medium">
              Solicitar redifinição
            </button>
          </div>
        </form>
      </div>
      <div class="signin w-full flex flex-col gap-4">
        <p class="text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition text-center">
          Já não precisa redifinir? <a [routerLink]="['/auth/sign-in']" class="text-[#3586FF]">Entre por aqui</a>
        </p>
      </div>
    </section>
  `,
  styles: ``
})
export class RequestPasswordResetPage {

}
