import { Injectable, signal } from '@angular/core';
import { AppThemeMode } from '@core/enums/user-setting.enum';

export type AppTheme = 'Claro' | 'Escuro' | 'Sistema' | 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'quantia_theme';
  activeTheme = signal<AppTheme>('Claro');

  constructor() {
    this.initTheme();
  }

  initTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as AppTheme | null;
    const themeToApply = saved || 'Claro';
    this.setTheme(themeToApply);
  }

  setTheme(theme: AppTheme): void {
    this.activeTheme.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    if (theme === 'Escuro' || theme === AppThemeMode.DARK) {
      document.documentElement.classList.add('dark');
    } else if (theme === 'Claro' || theme === AppThemeMode.LIGHT) {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'Sistema' || theme === AppThemeMode.SYSTEM) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
