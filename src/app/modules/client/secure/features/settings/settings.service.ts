import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpSchema } from "@core/services/http-schema.service";
import { UserSetting } from "@core/models/user-settings.model";
import { UserStore } from "@core/data/user-store.data";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private httpSchema = inject(HttpSchema);
  private userStore = inject(UserStore);

  getSettings(): Observable<UserSetting> {
    return this.httpSchema.get<UserSetting>('api/user/settings').pipe(
      tap(settings => {
        if (settings) {
          this.userStore.loadSettings(settings);
        }
      })
    );
  }

  updateSettings(data: Partial<UserSetting>): Observable<UserSetting> {
    return this.httpSchema.put<UserSetting>('api/user/settings', data).pipe(
      tap(settings => {
        if (settings) {
          this.userStore.updateLocalSettings(data);
        }
      })
    );
  }
}
