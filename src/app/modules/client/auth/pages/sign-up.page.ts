import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubmitableButton } from "@shared/directives/submitable-button";

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, SubmitableButton],
  template: `
    <section
    data-aos=""
    class="panel-section limited-container flex flex-col gap-5 items-center">
      <div class="invite-text max-w-[277px]">
        <p class="text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition text-center">
          Dê o primeiro passo: crie sua conta e simplifique seu controle financeiro
        </p>
      </div>
      <div class="form-container w-full">
        <form class="flex flex-col gap-5 w-full">
          <div class="input-wrapper w-full flex flex-col gap-[10px]">
            <label for="email" class="text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition">Email</label>
            <input type="email" id="email" placeholder="" required autocomplete=""
            class="focus:outline-none border border-black/5 rounded-[10px] px-4 py-[10px] bg-white" />
          </div>
          <div class="input-wrapper w-full flex flex-col gap-[10px]">
            <label for="password" class="text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition">Senha</label>
            <input type="password" id="password" placeholder="" required autocomplete=""
            class="focus:outline-none border border-black/5 rounded-[10px] px-4 py-[10px] bg-white" />
          </div>
          <div class="submit">
            <button appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-full text-sm border border-[#C29B00] rounded-[9px] px-2 py-[8px] font-medium">
              Criar na minha conta
            </button>
          </div>
        </form>
      </div>
      <div class="signin-and-otp-auth w-full flex flex-col gap-4">
        <p class="text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition text-center">
          Já possui uma conta? <a [routerLink]="['/auth/sign-in']" class="text-[#3586FF]">Entre por aqui</a>
        </p>
        <div class="option-line relative w-full text-center after:absolute after:z-[1] after:bg-[#E3E3E3]/50 after:h-[1px] after:top-[50%] after:translate-y-[-50%] after:w-full after:left-0">
          <span class="text-[#DDDDDD] !z-[2] relative px-3 text-center bg-white dark:bg-(color:--dm-bg) dm-bg-color-transition">OU</span>
        </div>
        <div class="otp-auth-button">
          <button class="w-full text-sm text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition border flex gap-4 justify-center items-center border-(color:--secondary)/10 dark:border-(color:--dm-secondary)/10 rounded-[9px] px-2 py-[8px]">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.39777 8.5C4.39777 7.95527 4.48824 7.43304 4.64972 6.94321L1.82335 4.78491C1.27251 5.90333 0.962158 7.16354 0.962158 8.5C0.962158 9.83531 1.27213 11.0948 1.82221 12.2124L4.64705 10.0499C4.4871 9.56237 4.39777 9.04205 4.39777 8.5Z" fill="#FBBC05"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.35998 3.54455C10.5434 3.54455 11.6122 3.96386 12.452 4.65L14.8951 2.21038C13.4064 0.914331 11.4977 0.113831 9.35998 0.113831C6.04117 0.113831 3.18885 2.01178 1.823 4.78494L4.64936 6.94324C5.3006 4.96639 7.15698 3.54455 9.35998 3.54455Z" fill="#EB4335"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.35997 13.4555C7.15698 13.4555 5.3006 12.0337 4.64936 10.0568L1.823 12.2147C3.18885 14.9883 6.04117 16.8862 9.35997 16.8862C11.4084 16.8862 13.364 16.1589 14.8318 14.7962L12.1489 12.7221C11.392 13.199 10.4388 13.4555 9.35997 13.4555Z" fill="#34A853"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3765 8.50004C17.3765 8.0045 17.3002 7.47083 17.1857 6.97528H9.36011V10.2154H13.8646C13.6394 11.3201 13.0263 12.1694 12.1491 12.7221L14.8319 14.7962C16.3737 13.3652 17.3765 11.2336 17.3765 8.50004Z" fill="#4285F4"/>
            </svg>
            Registrar com o Google
          </button>
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class SignUpPage {

}
