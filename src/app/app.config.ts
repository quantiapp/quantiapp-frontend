import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxMaskConfig, provideEnvironmentNgxMask } from "ngx-mask";
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { authInterceptor } from '@core/interceptors/auth.interceptor';

const maskConfig: Partial<NgxMaskConfig> = { thousandSeparator: '.', decimalMarker: ',' }

registerLocaleData(localePt);
registerLocaleData(localeEn)

export const appConfig: ApplicationConfig = {
  providers: [
    CurrencyPipe,
    provideEnvironmentNgxMask(maskConfig),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor]))
  ]
};
