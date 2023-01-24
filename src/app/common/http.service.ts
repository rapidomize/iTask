import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HttpService<T> {
  constructor(protected http: HttpClient, @Inject(String) protected apiEndpoint:string) { }

  read(id: string, path?: string): Observable<T> {
    const uri = `${this.apiEndpoint}${path!=null?`/${path}`:''}/${id}`;
    return this.http.get<T>(uri) 
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  } 

  //just deligate
  create (entity: T|any, path?: string): Observable<any> {
    return this.exec(entity, path);    
  }

  exec (entity: T|any, path?: string): Observable<any> {
    const uri = `${this.apiEndpoint}${path? `/${path}`:''}`;
    console.log('exec', uri);    
    return this.http.post(uri, entity, httpOptions)
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  }

  find(query?:string, path?:string): Observable<T[]> {
    const uri = `${this.apiEndpoint}${path? `/${path}`:''}${query?`?${query}`:''}`;
    console.log('find', uri);    
    return this.http.get<T[]>(uri)
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  }

  update (entity: T|any, path?: string, query?:string): Observable<any> {
    const uri = `${this.apiEndpoint}/${path? path: entity.id}`;
    console.log('update', uri);    
    return this.http.put(uri, entity, httpOptions)
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  }

  delete(id: string, path?: string, query?:string): Observable<T> {
    const uri = `${this.apiEndpoint}${path!=null? `/${path}`:''}/${id}${query?`${query?`?${query}`:''}`:''}`;
    console.log('delete', uri);    
    return this.http.delete<T>(uri) 
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Err code ${error.status}, body: `, error.error);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}