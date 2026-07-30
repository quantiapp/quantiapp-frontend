import { Injectable, inject, computed, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';
import { UserStore } from '@core/data/user-store.data';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private userStore = inject(UserStore);
  private destroyRef = inject(DestroyRef);

  private _isOffline = signal<boolean>(!navigator.onLine);
  isOffline = this._isOffline.asReadonly();

  hasOfflineSupport = computed(() => {
    return !!this.userStore.planLimits().has_offline_mode;
  });

  constructor() {
    merge(
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this._isOffline.set(!navigator.onLine);
    });
  }
}
