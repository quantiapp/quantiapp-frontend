import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AccountFacade } from '../account.facade';

export const accountResolver: ResolveFn<boolean> = (route, state) => {
  const facade = inject(AccountFacade);

  return facade.action();
};
