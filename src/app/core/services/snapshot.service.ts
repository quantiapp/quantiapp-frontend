import { Directive } from "@angular/core";
import { DashboardState } from "@client/secure/features/dashboard/models";
import { ISnapshotState } from "@core/interfaces/snapshot-state.interface";
import { BehaviorSubject, map, Observable } from "rxjs";

@Directive()
export abstract class Snapshot<T extends ISnapshotState> {
    
    private state$ = new BehaviorSubject<T>({
        snapshot: null,
        loading: false,
        error: null
    } as T);

    protected select$<K extends keyof T>(key: K) {
        return this.state$.asObservable().pipe(map(state => state[key]));
    }

    protected set state(patch: Partial<T>) {
        const current = this.state$.getValue();
        this.state$.next({ ...current, ...patch });
    }

    protected get state(): Observable<T> {
        return this.state$.asObservable();
    }

    protected resetState(defaultValue: T) {
        this.state$.next(defaultValue);
    }

    protected get snapshot$() {
        return this.select$('snapshot').pipe();
    }

    protected get loading$() {
        return this.select$('loading').pipe();
    }

    protected get error$() {
        return this.select$('error').pipe();
    }
}