import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MotionedHeight } from "@shared/directives/motioned-height";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-master',
  imports: [RouterOutlet, MotionedHeight, RouterLink, Darkable],
  template: `
    <!-- Fundo de ecrã inteiro no PC com tom escuro premium e elementos de design modernos -->
    <div class="master-wrapper min-h-screen bg-[#0E0E10] flex items-center justify-center p-0 md:py-6 md:px-4 relative overflow-hidden">
      
      <!-- Aura de retroiluminação (Ambient Glow) no centro atrás do smartphone -->
      <div class="hidden md:block absolute w-[700px] h-[700px] rounded-full bg-[#F1C40F]/10 blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <!-- Textura sutil de malha geométrica de fundo para Desktop -->
      <div class="hidden md:block absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>

      <!-- Container com limites de smartphone no Desktop -->
      <div class="app-frame w-full max-w-[480px] min-h-[100dvh] md:min-h-[850px] md:max-h-[90dvh] md:rounded-[2.25rem] md:shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-0 md:border md:border-white/10 overflow-y-auto overflow-x-hidden bg-white relative flex flex-col" appDarkable="dark:bg-(color:--dm-bg)">
        
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
