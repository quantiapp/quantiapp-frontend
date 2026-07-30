import { Injectable, Signal, signal } from "@angular/core";
import { UserSetting } from "@core/models/user-settings.model";
import { PlanLimits, User } from "@core/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserStore {
    private _user = signal<User | null>(null);
    private _settings = signal<UserSetting | null>(null);

    isUserLoaded = signal<boolean>(false);
    isSettingsLoaded = signal<boolean>(false);

    user: Signal<User | null> = this._user.asReadonly();
    settings: Signal<UserSetting | null> = this._settings.asReadonly();

    planLimits = signal<PlanLimits>({
        plan_name: 'free',
        max_accounts: 2,
        max_goals_per_account: 3,
        max_shares: 1,
        has_offline_mode: false
    });

    loadUser(data: User | null) {
        this._user.set(data);
        if (data?.plan_limits) {
            this.planLimits.set(data.plan_limits);
        }
        this.isUserLoaded.set(true);
    }

    updateLocalUser(changes: Partial<User>) {
        this._user.update(user => user ? { ...user, ...changes } : null);
        if (changes.plan_limits) {
            this.planLimits.set(changes.plan_limits);
        }
    }

    setPlanLimits(limits: PlanLimits) {
        this.planLimits.set(limits);
    }

    loadSettings(data: UserSetting | null) {
        this._settings.set(data);
        this.isSettingsLoaded.set(true);
    }

    updateLocalSettings(changes: Partial<UserSetting>) {
        this._settings.update(settings => settings ? { ...settings, ...changes } : null);
    }

    clear() {
        this._user.set(null);
        this._settings.set(null);
        this.isUserLoaded.set(false);
        this.isSettingsLoaded.set(false);
    }
}