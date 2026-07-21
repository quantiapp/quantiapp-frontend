import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

export const guestGuard: CanActivateFn = async (_route, _state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const token = await supabaseService.getAccessToken();

  if (token) {
    return router.createUrlTree(['/secure/dashboard']);
  }

  return true;
};
