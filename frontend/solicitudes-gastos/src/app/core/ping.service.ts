import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PingService {
  constructor(private http: HttpClient) {}

  ping(): Observable<any> {
    return this.http.get('/ping');
  }
}
