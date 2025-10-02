import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubmitableButton } from "@shared/directives/submitable-button";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-request-password-reset',
  imports: [RouterLink, SubmitableButton, Darkable],
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
        <form class="flex flex-col gap-5 w-full">
          <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
            <label for="email" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Email</label>
            <input type="email" id="email" placeholder="" required autocomplete=""
            class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white" />
          </div>
          <div class="submit">
            <button appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-[0.5rem] font-medium">
              Solicitar redifinição
            </button>
          </div>
        </form>
      </div>
      <div class="signin w-full flex flex-col gap-4">
        <p class="text-sm text-(color:--secondary) text-center" appDarkable="dark:text-(color:--dm-secondary)">
          Já não precisa redifinir? <a [routerLink]="['/auth/sign-in']" class="text-[#3586FF]">Entre por aqui</a>
        </p>
      </div>
    </section>
  `,
  styles: ``
})
export class RequestPasswordResetPage {

}
