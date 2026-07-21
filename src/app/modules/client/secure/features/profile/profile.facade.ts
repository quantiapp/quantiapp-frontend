import { inject, Injectable, Signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { User } from "@core/models/user.model";
import { Observable } from "rxjs";
import { ProfileService } from "./profile.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileFacade extends BaseActionFacade {
  private profileService = inject(ProfileService);

  get user(): Signal<User | null> {
    return this.userStore.user;
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.profileService.updateProfile(data);
  }

  deleteAccount(): Observable<any> {
    return this.profileService.deleteAccount();
  }
}
