import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxMaskConfig, provideEnvironmentNgxMask } from "ngx-mask";

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

const maskConfig: Partial<NgxMaskConfig> = { thousandSeparator: '.', decimalMarker: ',' }

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironmentNgxMask(maskConfig),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
