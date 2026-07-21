import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { environment } from '@environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabaseService = inject(SupabaseService);

  // Anexa o Bearer JWT Token em chamadas direcionadas ao servidor / API
  const isServerRequest = !environment.server || req.url.startsWith(environment.server) || req.url.includes('/api');

  if (isServerRequest) {
    const token = supabaseService.session()?.access_token;
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
  }

  return next(req);
};
