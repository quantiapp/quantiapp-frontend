import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TransactionFacade } from '../transaction.facade';

export const transactionResolver: ResolveFn<boolean> = (route, state) => {
  const facade = inject(TransactionFacade);
  
  if(facade.ignoreAction()){
    return true;
  }

  return facade.action()
};
