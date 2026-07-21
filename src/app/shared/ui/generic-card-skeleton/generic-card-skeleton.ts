import { Component, input } from '@angular/core';
import { TailwindClassApplier } from "@shared/directives/tailwind-class-applier";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-generic-card-skeleton',
  imports: [TailwindClassApplier, Darkable],
  template: `
    <div 
      class="bg-white rounded-[1.25rem] p-4 flex flex-col gap-4"
      appTailwindClassApplier [tailwindClassesArray]="tailwindClassesArray()"
      appDarkable="dark:bg-(color:--secondary)/70"
      >
      
      <!-- HEADER: Nome + Ícone -->
      <div class="flex justify-between items-center">
        <!-- Nome Fake -->
        <div class="w-32 h-5 skeleton rounded"></div>
        
        <!-- Ícone Fake (Quadrado ou Círculo) -->
        <div class="w-7 h-7 skeleton rounded-xl"></div>
      </div>

      <!-- CONTENT: Detalhes + Progresso -->
      <div class="flex flex-col gap-4 mt-2">
        
        <!-- Linha de detalhes (Moeda + Data) -->
        <div class="flex justify-between items-center">
          <div class="w-8 h-3 skeleton rounded"></div> <!-- Moeda -->
          <div class="w-24 h-3 skeleton rounded"></div> <!-- "Último movimento..." -->
        </div>

        <!-- Bloco de Progresso -->
        <div class="space-y-2">
          <!-- Números (Porcentagem + Valor) -->
          <div class="flex justify-between items-end">
            <div class="w-12 h-6 skeleton rounded"></div> <!-- 45% -->
            <div class="w-20 h-3 skeleton rounded"></div> <!-- 100.00 / 200.00 -->
          </div>
          
          @if(type() === 'goal') {
            <!-- Barra de Progresso Track -->
            <div class="w-full h-2 skeleton rounded-full! overflow-hidden">
               <!-- Não precisa da barra interna animada, o skeleton já brilha -->
            </div>
          }
        </div>

      </div>

      <!-- FOOT: Botões de Ação -->
      <div class="flex gap-[0.625rem] mt-2">
        <!-- Botão 1 (Adicionar) -->
        <div class="w-28 h-9 skeleton rounded-full!"></div>
        
        <!-- Botão 2 (Detalhes) -->
        <div class="w-28 h-9 skeleton rounded-full!"></div>
      </div>

    </div>
  `,
  styles: ``
})
export class GenericCardSkeleton {
  tailwindClassesArray = input<string[]>([]);
  type = input<'account' | 'goal'>('account');
}
