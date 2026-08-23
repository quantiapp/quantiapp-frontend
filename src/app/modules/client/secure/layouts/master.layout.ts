import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationPartial } from '@core/partials/client/secure/navigation.partial';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-master',
  imports: [RouterOutlet, NavigationPartial, Darkable],
  template: `
    <!-- Fundo de ecrã inteiro no PC com tom escuro premium -->
    <div class="master-wrapper min-h-screen bg-[#121212] flex items-center justify-center p-0 md:py-6 md:px-4">
      
      <!-- Container com limites de smartphone no Desktop -->
      <div class="app-frame w-full max-w-[480px] min-h-[100dvh] md:min-h-[850px] md:max-h-[90dvh] md:rounded-[2.25rem] md:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative flex flex-col bg-[#F2F4F5]" appDarkable="dark:bg-(color:--dm-bg)">
        
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
