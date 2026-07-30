import { Component, computed, inject } from '@angular/core';
import { FinanceStore } from '@core/data/finance-store.data';
import { UserStore } from '@core/data/user-store.data';
import { Darkable } from '@shared/directives/darkable';
import { SubmitableButton } from '@shared/directives/submitable-button';
import { PopupService } from '@core/services/pop-up.service';
import { IconContainerContainer } from '@shared/ui/icon/icon-container.container';
import { CardTemplate } from '@client/secure/ui/card.template';
import { DrawerComponent } from '@shared/components/drawer.component';
import { UpgradePlansComponent } from './components/upgrade-plans/upgrade-plans.component';
import { ProfileFacade } from './profile.facade';

@Component({
  selector: 'app-profile-page',
  imports: [Darkable, SubmitableButton, IconContainerContainer, CardTemplate, DrawerComponent, UpgradePlansComponent],
  template: `
    <div class="section-container py-8 flex flex-col min-h-screen gap-6 limited-container">
      
      <!-- PANEL HEADER & AVATAR -->
      <div class="flex flex-col items-center justify-center gap-4 py-2">
        <h1 class="panel-header text-lg font-medium text-center text-(--secondary)" appDarkable="dark:text-(--dm-secondary)/60">Perfil</h1>
        @if (user()?.avatar) {
          <img [src]="user()!.avatar" class="w-24 h-24 rounded-full object-cover shadow-md" alt="Avatar">
        } @else {
          <div class="w-24 h-24 rounded-full bg-[#F1C40F] flex items-center justify-center text-black font-semibold text-4xl shadow-md">
            {{ userInitial() }}
          </div>
        }
      </div>

      <!-- CARDS CONTAINER -->
      <div class="flex flex-col gap-5 max-w-[28rem] mx-auto w-full">

        <!-- INFORMAÇÕES PESSOAIS -->
        <app-card>
          <ng-container header>
            <h2 class="text-base font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Informações pessoais</h2>
          </ng-container>

          <div content class="flex flex-col">
            <!-- NOME -->
            <div class="flex items-center gap-4 py-3 border-b border-black/5 dark:border-white/5">
              <div class="text-(--secondary) shrink-0" appDarkable="dark:text-(--dm-secondary)">
                <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'user'" [colorAttr]="'stroke'"></app-icon-container>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Nome</span>
                <span class="text-xs text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ userName() }}</span>
              </div>
            </div>

            <!-- EMAIL (@ ICON) -->
            <div class="flex items-center gap-4 py-3 border-b border-black/5 dark:border-white/5">
              <div class="text-(--secondary) shrink-0" appDarkable="dark:text-(--dm-secondary)">
                <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'email'" [colorAttr]="'stroke'"></app-icon-container>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Email</span>
                <span class="text-xs text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ userEmail() }}</span>
              </div>
            </div>

            <!-- NOME DE UTILIZADOR (SEM BORDA EM BAIXO) -->
            <div class="flex items-center gap-4 pt-3">
              <div class="text-(--secondary) shrink-0" appDarkable="dark:text-(--dm-secondary)">
                <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'user-guard'" [colorAttr]="'stroke'"></app-icon-container>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Nome de utilizador</span>
                <span class="text-xs text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ username() }}</span>
              </div>
            </div>
          </div>
        </app-card>

        <!-- INFORMAÇÕES ADICIONAIS -->
        <app-card>
          <ng-container header>
            <h2 class="text-base font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Informações adicionais</h2>
          </ng-container>

          <div content class="flex flex-col gap-3">
            <!-- CONTAS -->
            <div class="flex items-center gap-4 pb-3 border-b border-black/5 dark:border-white/5">
              <div class="text-(--secondary) shrink-0" appDarkable="dark:text-(--dm-secondary)">
                <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'card'" [colorAttr]="'stroke'"></app-icon-container>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Contas</span>
                <span class="text-xs text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ accountCount() }}</span>
              </div>
            </div>

            <!-- METAS (COM BORDA) -->
            <div class="flex items-center gap-4 pb-3 border-b border-black/5 dark:border-white/5">
              <div class="text-(--secondary) shrink-0" appDarkable="dark:text-(--dm-secondary)">
                <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'big-flag'" [colorAttr]="'stroke'"></app-icon-container>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Metas</span>
                <span class="text-xs text-(--secondary)/60" appDarkable="dark:text-(--dm-secondary)/60">{{ goalCount() }}</span>
              </div>
            </div>

            <!-- PLANO ATUAL (SEM BORDA EM BAIXO) -->
            <div class="flex items-center gap-4 pt-1">
              <div class="text-(--secondary) shrink-0" appDarkable="dark:text-(--dm-secondary)">
                <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'user-guard'" [colorAttr]="'stroke'"></app-icon-container>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Plano Atual</span>
                <span class="text-xs text-amber-500 font-bold uppercase tracking-wider">
                  {{ userStore.planLimits().plan_name }}
                </span>
              </div>
            </div>
          </div>

          <div foot class="pt-2">
            <!-- PREMIUM BANNER CARD (DIAMOND ICON) -->
            <div class="banner-box border border-black/10 dark:border-white/10 rounded-[10px] p-4 flex flex-col gap-3">
              <div class="flex gap-3 items-start">
                <div class="text-[#F1C40F] mt-0.5 shrink-0">
                  <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'diamond'" [colorAttr]="'stroke'"></app-icon-container>
                </div>
                <p class="text-xs text-(--secondary) leading-relaxed" appDarkable="dark:text-(--dm-secondary)">
                  Obtenha todos os benefícios da aplicação actualizando para o plano Premium
                </p>
              </div>

              <q-drawer>
                <ng-template #invoker let-open="open">
                  <button
                  (click)="open()"
                  appSubmitableButton
                  tailwindClassBackgroundColor="bg-(color:--primary)/63"
                  tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,40%)]"
                  class="w-full text-sm border border-[#C29B00] rounded-[0.563rem] px-2 py-1.5 font-medium text-black cursor-pointer">
                    Actualizar
                  </button>
                </ng-template>
                <ng-template #panel let-close="close">
                  <app-upgrade-plans (onSuccess)="close()"></app-upgrade-plans>
                </ng-template>
              </q-drawer>
            </div>
          </div>
        </app-card>

        <!-- TERMINAR SESSÃO -->
        <app-card>
          <ng-container header>
            <h2 class="text-base font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Sessão</h2>
          </ng-container>

          <div content class="flex flex-col gap-4">
            <button
            (click)="logout()"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-(color:--primary)/20"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(241,196,15,10%)]"
            class="w-full text-sm border border-(color:--primary)/40 rounded-[0.563rem] px-2.5 text-center py-1.5 font-medium text-(color:--secondary)"
            appDarkable="dark:text-(--dm-secondary)">
              Terminar sessão
            </button>
          </div>
        </app-card>

        <!-- EXCLUIR A CONTA -->
        <app-card>
          <ng-container header>
            <h2 class="text-base font-semibold text-(--secondary)" appDarkable="dark:text-(--dm-secondary)">Excluir a conta</h2>
          </ng-container>

          <div content class="flex flex-col gap-4">
            <div class="alert-box bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 rounded-[10px] p-4 flex gap-3 items-center">
              <div class="text-red-500 shrink-0">
                <app-icon-container [tailwindClassArray]="['p-0!']" [width]="22" [height]="22" [key]="'warning'" [colorAttr]="'stroke'"></app-icon-container>
              </div>
              <p class="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                Ao excluir esta conta, os seus dados serão todos excluídos e terá meios de recuperação
              </p>
            </div>

            <button
            (click)="deleteAccount()"
            appSubmitableButton
            tailwindClassBackgroundColor="bg-[#FF252A]/60"
            tailwindClassShadowColor="inset-shadow-[0px_4px_4px_rgba(255,37,42,25%)]"
            class="w-full text-sm border border-[#B6070B]/40 rounded-[0.563rem] px-2.5 text-center py-1.5 font-medium text-black">
              Excluir conta
            </button>
          </div>
        </app-card>

      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class ProfilePage {
  private profileFacade = inject(ProfileFacade);
  private financeStore = inject(FinanceStore);
  protected readonly userStore = inject(UserStore);

  user = this.profileFacade.user;

  userName = computed(() => {
    return this.user()?.name || 'Isaquias Sebastião Marques';
  });

  userEmail = computed(() => {
    return this.user()?.email || 'patisaquias2000@gmail.com';
  });

  username = computed(() => {
    if (this.user()?.username) return this.user()!.username;
    const email = this.userEmail();
    return email ? email.split('@')[0] : 'patisaquias2000';
  });

  userInitial = computed(() => {
    const name = this.userName();
    return name ? name.charAt(0).toUpperCase() : 'I';
  });

  accountCount = computed(() => {
    return this.financeStore.accounts().length || 3;
  });

  goalCount = computed(() => {
    const userAccountIds = new Set(this.financeStore.accounts().map(acc => acc.id));
    return this.financeStore.goals().filter(goal => userAccountIds.has(goal.account_id)).length;
  });

  logout(): void {
    this.profileFacade.logout();
  }

  deleteAccount(): void {
    PopupService.confirm(
      "Tem a certeza de que pretende excluir a sua conta? Esta ação é irreversível.",
      () => {
        this.profileFacade.deleteAccount().subscribe({
          next: () => PopupService.success("Solicitação de exclusão submetida com sucesso."),
          error: () => PopupService.error("Erro ao solicitar exclusão de conta.")
        });
      }
    );
  }
}

