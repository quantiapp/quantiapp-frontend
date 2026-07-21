import { inject, Injectable } from "@angular/core";
import { UserSetting } from "@core/models/user-settings.model";
import { User } from "@core/models/user.model";
import { Observable, tap } from "rxjs";
import { HttpSchema } from "./http-schema.service";
import { UserStore } from "@core/data/user-store.data";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private httpSchema = inject(HttpSchema);
    private userStore = inject(UserStore);

    getUser(): Observable<User> {
        return this.httpSchema.get<User>('api/user/profile').pipe(
            tap((data) => this.userStore.loadUser(data))
        );
    }

    getUserSettings(): Observable<UserSetting> {
        return this.httpSchema.get<UserSetting>('api/user/settings').pipe(
            tap((data) => this.userStore.loadSettings(data))
        );
    }
}