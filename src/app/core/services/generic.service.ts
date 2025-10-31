import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Directive, inject, Injectable } from "@angular/core";
import { environment } from "environments/environment.development";
import { catchError, Observable, of } from "rxjs";
import { Snapshot } from "./snapshot.service";

@Injectable({
    providedIn: 'root'
})
export abstract class GenericApiService {

    private http = inject(HttpClient);

    private headers: HttpHeaders = new HttpHeaders({
        'Authorization': 'Bearer '
    });
        
    protected get<T>(endpoint: string, options: any = { endpoint: environment.server }): Observable<T>{
        const hdrs = (options.headers) ? this.appendOrReplaceHeaders(options.headers) : this.headers;

        return this.http.get<T>(`${ options.endpoint }/${ endpoint }`, { headers: hdrs })
        .pipe();
    }

    protected post<T>(uri: string, body: any,
        options: any = { endpoint: environment.server }
    ): Observable<T>{

        let localHeaders: HttpHeaders = this.appendOrReplaceHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'text/json',
            ...(options.headers instanceof HttpHeaders ? this.headersToObject(options.headers) : options.headers)
        });

        console.log("Estes são os headers para o meu endpoint: [POST] " + uri, localHeaders);
        return this.http.post<T>(`${ options.endpoint }/${ uri }`, body, { headers: localHeaders })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return of(null as T)
            })
        )
    }

    protected put<T>(uri: string, body: any,
        options: any = { endpoint: environment.server }
    ): Observable<T>{
        let localHeaders: HttpHeaders = this.appendOrReplaceHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'text/json',
            ...(options.headers instanceof HttpHeaders ? this.headersToObject(options.headers) : options.headers)
        });

        console.log("Estes são os headers para o meu endpoint: [PUT] " + uri, localHeaders);
        return this.http.put<T>(`${ options.endpoint }/${ uri }`, body, { headers: localHeaders })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return of(null as T)
            })
        )
    }

    protected patch<T>(uri: string, body: any,
        options: any = { endpoint: environment.server }
    ): Observable<T>{
        let localHeaders: HttpHeaders = this.appendOrReplaceHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'text/json',
            ...(options.headers instanceof HttpHeaders ? this.headersToObject(options.headers) : options.headers)
        });

        console.log("Estes são os headers para o meu endpoint: [PUT] " + uri, localHeaders);
        return this.http.patch<T>(`${ options.endpoint }/${ uri }`, body, { headers: localHeaders })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return of(null as T)
            })
        )
    }

    protected delete<T>(uri: string, options?: {}): Observable<T>{
        return this.http.delete<T>(`${ environment.server }/${ uri }`, options)
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return of(null as T)
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
            // this.alertService.add("Não é possível manter a comunicação com o servidor", LogStatus.ERROR)
        }
    }
}