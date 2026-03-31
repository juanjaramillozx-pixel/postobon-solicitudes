import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlertType = 'info' | 'success' | 'error';
export interface AlertPayload {
  message: string | null;
  type?: AlertType;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private _alert = new BehaviorSubject<AlertPayload>({ message: null, type: 'info' });

  get alert$(): Observable<AlertPayload> {
    return this._alert.asObservable();
  }

  show(message: string, type: AlertType = 'info', timeout = 4000) {
    this._alert.next({ message, type });
    if (timeout > 0) {
      setTimeout(() => this.clear(), timeout);
    }
  }

  clear() {
    this._alert.next({ message: null, type: 'info' });
  }
}
