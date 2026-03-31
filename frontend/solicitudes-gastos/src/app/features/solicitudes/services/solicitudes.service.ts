import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Solicitud } from '../models/solicitud.model';
import { ApiResponse } from '../models/api-response.model';
import { CrearSolicitudGastoDto } from '../models/crear-solicitud.dto';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../core/alert.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private readonly baseUrl = `${environment.apiUrl}/SolicitudesGastos`;
  private readonly requestTimeoutMs = 10000;

  constructor(
    private readonly http: HttpClient,
    private readonly alert: AlertService
  ) {}

  // =========================
  // NORMALIZADOR (CLAVE)
  // =========================
  private normalizeItem(item: any): Solicitud {
    return {
      ...item,
      valor: item.valor?.value ?? 0,
      fechaGasto: item.fechaGasto?.value ?? null,
      estado: this.mapEstado(item.estado)
    };
  }

  // =========================
  // MAPEO DE ESTADO (ENUM)
  // =========================
  private mapEstado(estado: number): string {
    switch (estado) {
      case 1: return 'Pendiente';
      case 2: return 'Aprobada';
      case 3: return 'Rechazada';
      default: return 'Desconocido';
    }
  }

  // =========================
  // MÉTODOS CENTRALES TIPADOS (SIN GENERICOS)
  // =========================
  private handleRequestList(obs: Observable<ApiResponse<any>>): Observable<Solicitud[]> {
    return obs.pipe(
      timeout(this.requestTimeoutMs),
      map(res => (res.data || []).map((x: any) => this.normalizeItem(x))),
      catchError(err => {
        console.error(err);
        this.alert.show('Error en la petición', 'error');
        return throwError(() => err);
      })
    );
  }

  private handleRequestItem(obs: Observable<ApiResponse<any>>): Observable<Solicitud> {
    return obs.pipe(
      timeout(this.requestTimeoutMs),
      map(res => this.normalizeItem(res.data)),
      catchError(err => {
        console.error(err);
        this.alert.show('Error en la petición', 'error');
        return throwError(() => err);
      })
    );
  }

  // =========================
  // CRUD
  // =========================

  list(): Observable<Solicitud[]> {
    return this.handleRequestList(
      this.http.get<ApiResponse<any>>(this.baseUrl)
    );
  }

  get(id: number | string): Observable<Solicitud> {
    return this.handleRequestItem(
      this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}`)
    );
  }

  create(payload: CrearSolicitudGastoDto): Observable<Solicitud> {
    return this.handleRequestItem(
      this.http.post<ApiResponse<any>>(this.baseUrl, payload)
    );
  }

  update(id: number | string, payload: CrearSolicitudGastoDto): Observable<void> {
    return this.http
      .put<ApiResponse<any>>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        timeout(this.requestTimeoutMs),
        map(() => void 0),
        catchError(err => {
          console.error(err);
          this.alert.show('Error actualizando la solicitud', 'error');
          return throwError(() => err);
        })
      );
  }

  // =========================
  // ACCIONES
  // =========================

  aprobar(id: number | string): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/${id}/aprobar`, {})
      .pipe(
        timeout(this.requestTimeoutMs),
        map(res => res.message || 'Solicitud aprobada'),
        catchError(err => {
          console.error(err);
          this.alert.show('Error al aprobar la solicitud', 'error');
          return throwError(() => err);
        })
      );
  }

  rechazar(id: number | string, body?: any): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/${id}/rechazar`, body || {})
      .pipe(
        timeout(this.requestTimeoutMs),
        map(res => res.message || 'Solicitud rechazada'),
        catchError(err => {
          console.error(err);
          this.alert.show('Error al rechazar la solicitud', 'error');
          return throwError(() => err);
        })
      );
  }
}