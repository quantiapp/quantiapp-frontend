import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, of, throwError } from "rxjs";
import { environment } from "environments/environment";
import { PopupService } from "./pop-up.service";
import { ConnectionService } from "./connection.service";
import { OfflineSyncService } from "./offline-sync.service";

@Injectable({
    providedIn: 'root'
})
export class HttpSchema {

    private http = inject(HttpClient);
    private connectionService = inject(ConnectionService);
    private offlineSyncService = inject(OfflineSyncService);

    private headers: HttpHeaders = new HttpHeaders({
        'Authorization': 'Bearer token'
    });
        
    get<T>(uri: string, options?: any): Observable<T>{
        const hdrs = (options?.headers) ? this.appendOrReplaceHeaders(options?.headers) : this.headers;

        return this.http.get<T>(`${ options?.url ?? environment.server }/${ uri }`, { headers: hdrs })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error)
            })
        );
    }

    private handleOfflineWrite<T>(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', uri: string, body: any): Observable<T> {
        let tempId: string | undefined;
        let mockedResponse = body ? { ...body } : {};

        if (method === 'POST') {
            tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            mockedResponse.id = tempId;
        }

        this.offlineSyncService.queueRequest(method, uri, body, tempId);
        return of({ data: mockedResponse } as any as T);
    }

    post<T>(uri: string, body: any, options?: any ): Observable<T>{
        if (this.connectionService.isOffline() && this.connectionService.hasOfflineSupport()) {
            return this.handleOfflineWrite<T>('POST', uri, body);
        }

        let localHeaders: HttpHeaders = this.appendOrReplaceHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'text/json',
            ...(options?.headers instanceof HttpHeaders ? this.headersToObject(options?.headers) : options?.headers)
        });

        console.log("Estes são os headers para o meu url: [POST] " + uri, localHeaders);
        return this.http.post<T>(`${ options?.url ?? environment.server }/${ uri }`, body, { headers: localHeaders })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error)
            })
        )
    }

    put<T>(uri: string, body: any, options?: any): Observable<T>{
        if (this.connectionService.isOffline() && this.connectionService.hasOfflineSupport()) {
            return this.handleOfflineWrite<T>('PUT', uri, body);
        }

        let localHeaders: HttpHeaders = this.appendOrReplaceHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'text/json',
            ...(options?.headers instanceof HttpHeaders ? this.headersToObject(options?.headers) : options?.headers)
        });

        console.log("Estes são os headers para o meu url: [PUT] " + uri, localHeaders);
        return this.http.put<T>(`${ options?.url ?? environment.server }/${ uri }`, body, { headers: localHeaders })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error)
            })
        )
    }

    patch<T>(uri: string, body: any, options?: any): Observable<T>{
        if (this.connectionService.isOffline() && this.connectionService.hasOfflineSupport()) {
            return this.handleOfflineWrite<T>('PATCH', uri, body);
        }

        let localHeaders: HttpHeaders = this.appendOrReplaceHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'text/json',
            ...(options?.headers instanceof HttpHeaders ? this.headersToObject(options?.headers) : options?.headers)
        });

        console.log("Estes são os headers para o meu url: [PUT] " + uri, localHeaders);
        return this.http.patch<T>(`${ options?.url ?? environment.server }/${ uri }`, body, { headers: localHeaders })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error)
            })
        )
    }

    delete<T>(uri: string, options?: {}): Observable<T>{
        if (this.connectionService.isOffline() && this.connectionService.hasOfflineSupport()) {
            return this.handleOfflineWrite<T>('DELETE', uri, null);
        }

        return this.http.delete<T>(`${ environment.server }/${ uri }`, options)
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error)
            })
        )
    }

    private headersToObject(headers: HttpHeaders): Record<string, string>{
        const object: Record<string, string> = {};
        headers.keys().forEach(key => {
            const value = headers.get(key);
            if(value !== null) object[key] = value;
        });
        return object;
    }

    private appendOrReplaceHeaders(headers: { [name: string]: string }): HttpHeaders { 
        let hdrs: HttpHeaders = this.headers;
        for(let key in headers){
            hdrs = hdrs.set(key, headers[key]);
        }
        return hdrs;
    }

    private connectionError(error: any): void{
        if(error.status === 0){
            PopupService.error("Não é possível manter a comunicação com o servidor");
        }
    }
}