import { Observable } from "rxjs"

export interface ISnapshotState {
    snapshot: any | null
    loading: boolean
    error: string | null
}

export interface ISnapshot<MODULE_SNAPSHOT = any> {
    get getState(): Observable<ISnapshotState>;
    get loadSnapshot(): Observable<MODULE_SNAPSHOT>
}