import { Injectable, Signal, signal } from "@angular/core";
import { UserSetting } from "@core/models/user-settings.model";
import { User } from "@core/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserStore {
    private _user = signal<User | null>(null);
    private _settings = signal<UserSetting | null>(null);

    user: Signal<User | null> = this._user.asReadonly();
    settings: Signal<UserSetting | null> = this._settings.asReadonly();

    loadUser(data: User) {
        this._user.set(data);
    }

    updateLocalUser(changes: Partial<User>) {
        this._user.update(user => user ? { ...user, ...changes } : null);
    }

    loadSettings(data: UserSetting) {
        this._settings.set(data);
    }

    updateLocalSettings(changes: Partial<UserSetting>) {
        this._settings.update(settings => settings ? { ...settings, ...changes } : null)
    }
}