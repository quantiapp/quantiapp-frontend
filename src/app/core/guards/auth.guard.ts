import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

export const authGuard: CanActivateFn = async (_route, _state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const token = await supabaseService.getAccessToken();

  if (token) {
    return true;
  }

  return router.createUrlTree(['/auth/sign-in']);
};
