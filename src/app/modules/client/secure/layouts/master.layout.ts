import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationPartial } from '@core/partials/client/secure/navigation.partial';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-master',
  imports: [RouterOutlet, NavigationPartial, Darkable],
  template: `
    <!-- Fundo de ecrã inteiro no PC com tom escuro premium e elementos de design modernos -->
    <div class="master-wrapper min-h-screen bg-[#0E0E10] flex items-center justify-center p-0 md:py-6 md:px-4 relative overflow-hidden">
      
      <!-- Aura de retroiluminação (Ambient Glow) no centro atrás do smartphone -->
      <div class="hidden md:block absolute w-[700px] h-[700px] rounded-full bg-[#F1C40F]/10 blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <!-- Textura sutil de malha geométrica de fundo para Desktop -->
      <div class="hidden md:block absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none"></div>

      <!-- Container com limites de smartphone no Desktop -->
      <div class="app-frame w-full max-w-[480px] min-h-[100dvh] md:min-h-[850px] md:max-h-[90dvh] md:rounded-[2.25rem] md:shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-0 md:border md:border-white/10 overflow-hidden relative flex flex-col bg-[#F2F4F5] z-10" appDarkable="dark:bg-(color:--dm-bg)">
        
        <!-- Área de conteúdo com scroll interno -->
        <div class="master-container flex-1 overflow-y-auto overflow-x-hidden">
          <router-outlet></router-outlet>
        </div>

        <!-- Menu de navegação fixo no fundo da frame -->
        <div class="menu sticky bottom-0 z-[101] w-full">
          <app-navigation />
        </div>

      </div>
    </div>
  `,
  styles: ``
})
export class MasterLayout {

}
