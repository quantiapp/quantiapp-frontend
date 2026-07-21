import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { PopupService } from '@core/services/pop-up.service';

export const recoveryGuard: CanActivateFn = async (_route, _state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Verifica se há uma sessão ativa de recuperação ou token recovery na URL
  const session = supabaseService.session();
  const hash = window.location.hash || '';
  const search = window.location.search || '';

  const hasRecoveryToken = hash.includes('type=recovery') || search.includes('type=recovery') || session !== null;

  if (hasRecoveryToken) {
    return true;
  }

  PopupService.error('Link de redefinição de palavra-passe inválido ou expirado.');
  return router.createUrlTree(['/auth/sign-in']);
};
