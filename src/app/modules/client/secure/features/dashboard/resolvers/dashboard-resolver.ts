import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardFacade } from '../dashboard.facade';

export const dashboardResolver: ResolveFn<boolean> = (route, state) => {
  const facade = inject(DashboardFacade);
  return facade.action();
};
