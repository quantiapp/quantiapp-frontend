import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SettingsFacade } from '../settings.facade';

export const settingsResolver: ResolveFn<boolean> = (_route, _state) => {
  const facade = inject(SettingsFacade);

  return facade.action();
};
