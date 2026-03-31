import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../services/solicitudes.service';
import { Solicitud } from '../../models/solicitud.model';

@Component({
  selector: 'app-solicitudes-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading = false;

  total = 0;
  aprobadas = 0;
  rechazadas = 0;
  montoAprobado = 0;

  constructor(private service: SolicitudesService) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading = true;

    this.service.list().subscribe({
      next: (data: Solicitud[]) => {

        const items = data || [];

        this.total = items.length;

        this.aprobadas = items.filter(x => x.estado === 'Aprobada').length;

        this.rechazadas = items.filter(x => x.estado === 'Rechazada').length;

        this.montoAprobado = items
          .filter(x => x.estado === 'Aprobada')
          .reduce((sum, x) => sum + (x.valor || 0), 0);
      },
      error: () => {},
      complete: () => {
        this.loading = false;
      }
    });
  }
}