import { inject, Injectable, Signal } from "@angular/core";
import { BaseActionFacade } from "@core/base/action-facade";
import { User } from "@core/models/user.model";
import { Observable } from "rxjs";
import { ProfileService } from "./profile.service";
import { SupabaseService } from "@core/services/supabase.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProfileFacade extends BaseActionFacade {
  private profileService = inject(ProfileService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  get user(): Signal<User | null> {
    return this.userStore.user;
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.profileService.updateProfile(data);
  }

  deleteAccount(): Observable<any> {
    return this.profileService.deleteAccount();
  }

  async logout(): Promise<void> {
    await this.supabaseService.signOut();
    this.userStore.clear();
    this.financeStore.clear();
    this.router.navigate(['/auth/sign-in']);
  }
}

