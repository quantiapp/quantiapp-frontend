import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { BaseResourceService } from "@core/abstracts/base-resource.abstract";
import { User } from "@core/models/user.model";
import { UserStore } from "@core/data/user-store.data";

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseResourceService<User> {
  private userStore = inject(UserStore);

  getProfile(): Observable<User> {
    return this.httpShema.get<User>('api/user/profile').pipe(
      tap(user => {
        if (user) {
          this.userStore.loadUser(user);
        }
      })
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.httpShema.put<User>('api/user/profile', data).pipe(
      tap(user => {
        if (user) {
          this.userStore.updateLocalUser(data);
        }
      })
    );
  }

  deleteAccount(): Observable<any> {
    return this.httpShema.delete<any>('api/user/account').pipe(
      tap(() => {
        this.userStore.loadUser(null as any);
      })
    );
  }
}
