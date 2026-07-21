import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, of, throwError } from "rxjs";
import { environment } from "environments/environment";
import { PopupService } from "./pop-up.service";

@Injectable({
    providedIn: 'root'
})
export class HttpSchema {

    private http = inject(HttpClient);

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

    post<T>(uri: string, body: any, options?: any ): Observable<T>{

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