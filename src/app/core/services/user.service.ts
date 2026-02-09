import { inject, Injectable } from "@angular/core";
import { UserSetting } from "@core/models/user-settings.model";
import { User } from "@core/models/user.model";
import { Observable, tap } from "rxjs";
import { HttpSchema } from "./http-schema.service";
import { UserStore } from "@core/data/user-store.data";
import { CoreSimulator } from "./core.simulator.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private httpSchema = inject(HttpSchema);
    private simulator = inject(CoreSimulator);
    private userStore = inject(UserStore);

    getUser(): Observable<User> {
        // this.httpSchema.get<User>(`/api/user`).pipe(
        return this.simulator.user().pipe(
            tap((data) => this.userStore.loadUser(data))
        );
    }

    getUserSettings(): Observable<UserSetting> {
        // this.httpSchema.get<User>(`/api/user/settings`).pipe(
        return this.simulator.userSettings().pipe(
            tap((data) => this.userStore.loadSettings(data))
        );
    }
}