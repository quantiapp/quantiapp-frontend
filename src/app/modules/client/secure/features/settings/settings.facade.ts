import { inject, Injectable, Signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { UserSetting } from "@core/models/user-settings.model";
import { User } from "@core/models/user.model";
import { Currency } from "@core/models/currency.model";
import { Observable } from "rxjs";
import { SettingsService } from "./settings.service";
import { ThemeService, AppTheme } from "@core/services/theme.service";

@Injectable({
  providedIn: 'root'
})
export class SettingsFacade extends BaseActionFacade {
  private settingsService = inject(SettingsService);
  private themeService = inject(ThemeService);

  get settings(): Signal<UserSetting | null> {
    return this.userStore.settings;
  }

  get user(): Signal<User | null> {
    return this.userStore.user;
  }

  get currencies(): Signal<Currency[]> {
    return this.financeStore.currencies;
  }

  get activeTheme(): Signal<AppTheme> {
    return this.themeService.activeTheme;
  }

  setTheme(theme: AppTheme): void {
    this.themeService.setTheme(theme);
  }

  updateSettings(data: Partial<UserSetting>): Observable<UserSetting> {
    return this.settingsService.updateSettings(data);
  }
}

