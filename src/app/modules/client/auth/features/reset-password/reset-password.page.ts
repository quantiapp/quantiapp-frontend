import { Component } from '@angular/core';
import { MotionedHeight } from "@shared/directives/motioned-height";
import { SubmitableButton } from "@shared/directives/submitable-button";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-reset-password',
  imports: [MotionedHeight, SubmitableButton, Darkable],
  template: `
    <section
    data-aos=""
    class="panel-section limited-container flex flex-col gap-5 items-center">
      <div class="form-container w-full">
        <form class="flex flex-col gap-5 w-full">
          <div class="motionedHeight" appMotionedHeight [RouterOutletable]="false">
            <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
              <label for="password" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Nova senha</label>
              <input type="password" id="password" placeholder="" required autocomplete=""
              class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white" />
            </div>
          </div>
          <div class="input-wrapper w-full flex flex-col gap-[0.625rem]">
            <label for="confirm-password" class="text-sm text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">Confirme a senha</label>
            <input type="password" id="confirm-password" placeholder="" required autocomplete=""
            class="focus:outline-none border border-black/5 rounded-[0.625rem] px-4 py-[0.625rem] bg-white" />
          </div>
          <div class="submit">
            <button appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/63"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
            class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-[0.5rem] font-medium">
              Redifinir a senha
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: ``
})
export class ResetPasswordPage {

}
