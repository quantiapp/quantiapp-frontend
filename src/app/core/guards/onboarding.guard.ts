import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '@core/data/user-store.data';
import { DashboardFacade } from '@client/secure/features/dashboard/dashboard.facade';
import { catchError, map, of } from 'rxjs';

export const onboardingGuard: CanActivateFn = (_route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const dashboardFacade = inject(DashboardFacade);

  const checkAccess = () => {
    const settings = userStore.settings();
    const hasCurrency = !!settings?.currency_id;
    const isOnboardingRoute = state.url.includes('/secure/onboarding');

    // Se a moeda padrão ainda não está configurada e tenta aceder a outra rota privada, redireciona para o onboarding
    if (!hasCurrency && !isOnboardingRoute) {
      return router.createUrlTree(['/secure/onboarding']);
    }

    // Se o utilizador já concluiu a configuração da moeda e tenta abrir /secure/onboarding, redireciona para a dashboard
    if (hasCurrency && isOnboardingRoute) {
      return router.createUrlTree(['/secure/dashboard']);
    }

    return true;
  };

  if (userStore.isSettingsLoaded()) {
    return checkAccess();
  }

  return dashboardFacade.action().pipe(
    map(() => checkAccess()),
    catchError(() => of(true))
  );
};

