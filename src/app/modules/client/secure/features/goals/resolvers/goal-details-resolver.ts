import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GoalFacade } from '../goal.facade';

export const goalResolver: ResolveFn<boolean> = (route, state) => {
  const facade = inject(GoalFacade);
  
  if(facade.ignoreAction()){
    return true;
  }

  return facade.action();
};
