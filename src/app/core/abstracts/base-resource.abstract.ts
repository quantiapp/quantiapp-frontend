import { inject } from "@angular/core"
import { HttpSchema } from "@core/services/http-schema.service";
import { Observable } from "rxjs";

export interface BaseModel{
    id: string
}

export abstract class BaseResourceService<T extends BaseModel> {
    private httpShema = inject(HttpSchema);

    protected getAll(uri: string): Observable<T[]> {
        return this.httpShema.get<T[]>(uri);
    }

    protected getById(id: string, uri: string): Observable<T | T[]> {
        return this.httpShema.get(`${uri}/${id}`);
    }

    protected create(resource: Partial<T>, uri: string): Observable<T> {
        return this.httpShema.post(uri, resource);
    }

    protected update(id: string, resource: Partial<T>, uri: string): Observable<T> {
        return this.httpShema.put<T>(`${uri}/${id}`, resource);
    }

    protected delete(id: string, uri: string): Observable<void> {
        return this.httpShema.delete<void>(`${uri}/${id}`);
    }
}