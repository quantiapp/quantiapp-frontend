import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-data',
  imports: [],
  template: `
    <div class="fixed overflow-hidden inset-0 z-50 h-screen flex flex-col items-center justify-center bg-white/80 dark:bg-[#373737]/60 backdrop-blur-md">
      <div class="relative w-24 h-24 mb-6">
        <div class="absolute inset-0 rounded-full border-4 border-t-primary! border-black/10 dark:border-white/10 animate-spin"></div>
        <div class="absolute inset-2 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
          <span class="material-icons-round text-3xl">savings</span>
        </div>
      </div>
      <h2 class="text-xl font-bold mb-2 font-display text-(--secondary) dark:text-white">Organizando suas finanças...</h2>
      <p class="text-slate-500 dark:text-white/60 text-sm font-display">O primeiro passo é o mais valioso.</p>
      
      <!-- Barra de Progresso -->
      <div class="w-64 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mt-8 overflow-hidden relative">
        <div class="absolute top-0 bottom-0 bg-primary animate-progress rounded-full"></div>
      </div>
    </div>
  `,
  styles: `

  `
})
export class LoadingDataUi {

}
