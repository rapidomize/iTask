import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class Context {

  private data = new BehaviorSubject(null);
  constructor() { }

  put(data: any) {
    this.data.next(data)
  }

  get(): Observable<any>{
    return this.data.asObservable();
  }
}
