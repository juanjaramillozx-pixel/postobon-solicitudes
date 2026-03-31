import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private _message$ = new BehaviorSubject<string | null>(null);
  private _resolver: ((value: boolean) => void) | null = null;

  get message$() { return this._message$.asObservable(); }

  confirm(message: string): Promise<boolean> {
    this._message$.next(message);
    return new Promise(resolve => {
      this._resolver = resolve;
    });
  }

  resolve(value: boolean) {
    if (this._resolver) this._resolver(value);
    this._resolver = null;
    this._message$.next(null);
  }
}
