import { Observable } from "rxjs";

export interface IDataSimulator<T> {
    data(): Observable<T>;
}