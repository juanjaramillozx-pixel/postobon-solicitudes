import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil, timeout } from 'rxjs';
import { SolicitudesService } from '../../services/solicitudes.service';
import { Solicitud } from '../../models/solicitud.model';
import { AlertService } from '../../../../core/alert.service';
import { ConfirmService } from '../../../../shared/confirm/confirm.service';

@Component({
  selector: 'app-solicitudes-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  loading = false;
  refreshing = false;
  error = '';
  item?: Solicitud;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: SolicitudesService,
    private readonly router: Router,
    private readonly alert: AlertService,
    private readonly confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params.get('id'));
        if (id) {
          const navigationItem = history.state.item as Solicitud | undefined;
          if (navigationItem?.id === id) {
            this.item = navigationItem;
            this.load(id, true);
            return;
          }

          this.load(id);
        } else {
          this.error = 'ID inválido';
          this.item = undefined;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get canEdit(): boolean {
    return this.item?.estado === 'Pendiente';
  }

  load(id: number, background = false): void {
    if (background) {
      this.refreshing = true;
    } else {
      this.loading = true;
    }

    this.error = '';

    this.service.get(id)
      .pipe(
        timeout(10000),
        takeUntil(this.destroy$),
        finalize(() => {
          if (background) {
            this.refreshing = false;
          } else {
            this.loading = false;
          }
        })
      )
      .subscribe({
        next: (d) => {
          this.item = d;
        },
        error: () => {
          this.error = 'No se pudo completar la carga del detalle.';

          this.alert.show('No se pudo cargar la solicitud', 'error');
        }
      });
  }

  async onApprove(): Promise<void> {
    if (!this.item || this.loading || this.refreshing) return;

    const ok = await this.confirm.confirm('¿Confirmas aprobar esta solicitud?');
    if (!ok) return;

    this.ejecutarAccion(
      () => this.service.aprobar(this.item!.id),
      'Aprobada',
      'Solicitud aprobada'
    );
  }

  async onReject(): Promise<void> {
    if (!this.item || this.loading || this.refreshing) return;

    const ok = await this.confirm.confirm('¿Confirmas rechazar esta solicitud?');
    if (!ok) return;

    this.ejecutarAccion(
      () => this.service.rechazar(this.item!.id),
      'Rechazada',
      'Solicitud rechazada'
    );
  }

  private ejecutarAccion(
    accion: () => any,
    estado: Solicitud['estado'],
    mensajeOk: string
  ): void {
    this.loading = true;

    accion()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          if (this.item) {
            this.item = {
              ...this.item,
              estado
            };
          }

          this.alert.show(mensajeOk, 'success');
        },
        error: () => {
          this.alert.show('Ocurrió un error en la operación', 'error');
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/solicitudes']);
  }

  goToEdit(): void {
    if (!this.item) return;

    this.router.navigate(['/solicitudes', this.item.id, 'editar']);
  }
}