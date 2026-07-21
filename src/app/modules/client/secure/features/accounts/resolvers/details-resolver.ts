import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { RouterService } from '@core/services/router.service';
import { DetailsFacade } from '../account-details/details.facade';

export const detailsResolver: ResolveFn<boolean> = (route, state) => {
  const facade = inject(DetailsFacade);
  const routerService = inject(RouterService);
  const id = route.paramMap.get('id');

  if(!id){
    routerService.routeToSecureIndex('accounts');
    return false;
  }

  if(facade.ignoreAction({ accountId: id! })) return true;

  return facade.action({ accountId: id! });
};