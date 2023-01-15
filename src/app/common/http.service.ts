import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HttpService<T> {
  constructor(private http: HttpClient, @Inject(String) private apiEndpoint:string) { }

  read(id: string, path?: string): Observable<T> {
    return this.http.get<T>(`${this.apiEndpoint}${path!=null? `/${path}`:''}/${id}`) 
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
    // console.log(`${this.apiEndpoint}/${path!==undefined? path:''}`);
    return this.http.post(`${this.apiEndpoint}${path? `/${path}`:''}`, entity, httpOptions)
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  }

  find(query?:string, path?:string): Observable<T[]> {
    let url = `${this.apiEndpoint}${path? `/${path}`:''}?${query}`;
    return this.http.get<T[]>(this.apiEndpoint)
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  }

  update (entity: T|any, path?: string): Observable<any> {
    // console.log(`${this.apiEndpoint}/${path!==undefined? path:''}`);
    return this.http.put(`${this.apiEndpoint}/${path!==undefined? path:''}`, entity, httpOptions)
    .pipe(
      retry(1), 
      catchError(this.handleError) 
    );
  }

  delete(id: string, path?: string): Observable<T> {
    return this.http.delete<T>(`${this.apiEndpoint}${path!=null? `/${path}`:''}/${id}`) 
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