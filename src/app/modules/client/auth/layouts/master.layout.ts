import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MotionedHeight } from "@shared/directives/motioned-height";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-master',
  imports: [RouterOutlet, MotionedHeight, RouterLink, Darkable],
  template: `
    <!-- Fundo de ecrã inteiro no PC com tom escuro premium -->
    <div class="master-wrapper min-h-screen bg-[#121212] flex items-center justify-center p-0 md:py-6 md:px-4">
      
      <!-- Container com limites de smartphone no Desktop -->
      <div class="app-frame w-full max-w-[480px] min-h-[100dvh] md:min-h-[850px] md:max-h-[90dvh] md:rounded-[2.25rem] md:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-y-auto overflow-x-hidden bg-white relative flex flex-col" appDarkable="dark:bg-(color:--dm-bg)">
        
        <div class="panel-container h-full flex flex-col gap-5 justify-center py-8">
          <div
          data-aos="zoom-in-down"
          class="container-header flex flex-col gap-[0.625rem] justify-center items-center">
            <div class="logo w-[3.438rem] h-[3.438rem] rounded-full border border-(color:--primary)">
              <a routerLink="/">
                <img src="/static/primary-brand.svg" class="w-full h-full" alt="Quantiapp logo">
              </a>
            </div>
            <span class="app-name font-bold text-xl text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">QuantiAPP</span>
          </div>
          <div
          class="container-content flex flex-col" appMotionedHeight [RouterOutletable]="true">
            <router-outlet></router-outlet>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: ``
})
export class MasterLayout {

}
