import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProfileFacade } from '../profile.facade';

export const profileResolver: ResolveFn<boolean> = (_route, _state) => {
  const facade = inject(ProfileFacade);

  return facade.action();
};
