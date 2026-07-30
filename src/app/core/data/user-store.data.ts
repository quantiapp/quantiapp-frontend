import { Injectable, Signal, signal } from "@angular/core";
import { UserSetting } from "@core/models/user-settings.model";
import { PlanLimits, User } from "@core/models/user.model";
import { environment } from "@environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserStore {
    private _user = signal<User | null>(this.loadCache('user', null));
    private _settings = signal<UserSetting | null>(this.loadCache('settings', null));

    isUserLoaded = signal<boolean>(this.loadCache('user', null) !== null);
    isSettingsLoaded = signal<boolean>(this.loadCache('settings', null) !== null);

    user: Signal<User | null> = this._user.asReadonly();
    settings: Signal<UserSetting | null> = this._settings.asReadonly();

    planLimits = signal<PlanLimits>({
        plan_name: 'free',
        max_accounts: 2,
        max_goals_per_account: 3,
        max_shares: 1,
        has_offline_mode: false
    });

    canSeeBalances = signal<boolean>(this.loadBalanceVisibility());

    private loadBalanceVisibility(): boolean {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem('quantia_can_see_balances') !== 'false';
    }

    toggleBalanceVisibility(): void {
        const newValue = !this.canSeeBalances();
        this.canSeeBalances.set(newValue);
        if (typeof window !== 'undefined') {
            localStorage.setItem('quantia_can_see_balances', String(newValue));
        }
    }

    constructor() {
        const cachedUser = this._user();
        if (cachedUser?.plan_limits) {
            this.planLimits.set(cachedUser.plan_limits);
        }
    }

    setTrialEnd(trialEndsAt: string): void {
        this.updateLocalUser({ trial_ends_at: trialEndsAt });
    }

    getRemainingTrialDays(): number {
        const user = this._user();
        if (!user || !user.trial_ends_at) return 0;
        const trialEnd = new Date(user.trial_ends_at);
        const now = new Date();
        const diffTime = trialEnd.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    private loadCache<T>(key: string, defaultValue: T): T {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const cached = localStorage.getItem(`quantia_cache_${key}`);
            return cached ? JSON.parse(cached) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    private saveCache(key: string, data: any): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(`quantia_cache_${key}`, JSON.stringify(data));
        } catch (e) {
            console.error(`Erro ao salvar cache de utilizador para ${key}:`, e);
        }
    }

    loadUser(data: User | null) {
        this._user.set(data);
        if (data?.plan_limits) {
            this.planLimits.set(data.plan_limits);
        }
        this.isUserLoaded.set(true);
        this.saveCache('user', data);
    }

    updateLocalUser(changes: Partial<User>) {
        this._user.update(user => {
            const updated = user ? { ...user, ...changes } : null;
            this.saveCache('user', updated);
            return updated;
        });
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
        this.saveCache('settings', data);
    }

    updateLocalSettings(changes: Partial<UserSetting>) {
        this._settings.update(settings => {
            const updated = settings ? { ...settings, ...changes } : null;
            this.saveCache('settings', updated);
            return updated;
        });
    }

    clear() {
        this._user.set(null);
        this._settings.set(null);
        this.isUserLoaded.set(false);
        this.isSettingsLoaded.set(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('quantia_cache_user');
            localStorage.removeItem('quantia_cache_settings');
            localStorage.removeItem('quantia_can_see_balances');
        }
    }
}