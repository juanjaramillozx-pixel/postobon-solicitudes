import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, finalize, startWith, Subject, takeUntil } from 'rxjs';

import { SolicitudesService } from '../../services/solicitudes.service';
import { Solicitud } from '../../models/solicitud.model';
import { AlertService } from '../../../../core/alert.service';
import { ConfirmService } from '../../../../shared/confirm/confirm.service';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();
  readonly skeletonRows = [1, 2, 3, 4, 5, 6];

  loading = false;

  items: Solicitud[] = [];
  pagedItems: Solicitud[] = [];
  filteredItemsCount = 0;

  categorias: string[] = [];

  processingIds = new Set<number>();

  currentPage = 1;
  totalPages = 1;

  filterForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: SolicitudesService,
    private readonly router: Router,
    private readonly alert: AlertService,
    private readonly confirm: ConfirmService
  ) {}

  ngOnInit(): void {

    this.filterForm = this.fb.group({
      search: [''],
      estado: [''],
      categoria: [''],
      fechaFrom: [''],
      fechaTo: [''],
      sortField: [''],
      sortDir: ['asc'],
      pageSize: [10]
    });

    // 🔥 SOLUCIÓN CLAVE: dispara al inicio también
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value), // ✅ evita bug de “solo carga al escribir”
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.applyAll();
      });

    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // LOAD DATA (FIX LOADING)
  // =========================
  load(): void {
    this.loading = true;

    this.service.list()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false) // ✅ SIEMPRE se apaga loader
      )
      .subscribe({
        next: (data) => {
          this.items = data || [];

          this.syncCategorias();

          this.applyAll(); // ✅ asegura render inmediato
        },
        error: () => {
          this.alert.show('Error cargando solicitudes', 'error');
        }
      });
  }

  // =========================
  // PIPELINE
  // =========================
  applyAll(): void {
    let result = this.filterData(this.items);
    this.filteredItemsCount = result.length;
    result = this.sortData(result);
    this.paginateData(result);
  }

  // =========================
  // FILTROS
  // =========================
  private filterData(data: Solicitud[]): Solicitud[] {
    const f = this.filterForm.value;
    const search = (f.search || '').trim().toLowerCase();
    const categoria = (f.categoria || '').toLowerCase();
    const fechaFrom = f.fechaFrom ? new Date(f.fechaFrom).getTime() : null;
    const fechaTo = f.fechaTo ? new Date(f.fechaTo).getTime() : null;

    return data.filter(x => {

      if (f.estado && x.estado !== f.estado) return false;

      if (categoria && !x.categoria?.toLowerCase().includes(categoria)) return false;

      if (search) {
        if (
          !(x.descripcion || '').toLowerCase().includes(search) &&
          !(x.usuario || '').toLowerCase().includes(search)
        ) return false;
      }

      if (fechaFrom && new Date(x.fechaGasto).getTime() < fechaFrom) return false;

      if (fechaTo && new Date(x.fechaGasto).getTime() > fechaTo) return false;

      return true;
    });
  }

  // =========================
  // SORT
  // =========================
  private sortData(data: Solicitud[]): Solicitud[] {
    const { sortField, sortDir } = this.filterForm.value;

    if (!sortField) return data;

    const dir = sortDir === 'asc' ? 1 : -1;

    return [...data].sort((a: any, b: any) => {
      const va = a[sortField];
      const vb = b[sortField];

      if (va == null) return -1 * dir;
      if (vb == null) return 1 * dir;

      if (sortField === 'fechaGasto') {
        return (new Date(va).getTime() - new Date(vb).getTime()) * dir;
      }

      if (typeof va === 'number') {
        return (va - vb) * dir;
      }

      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  // =========================
  // PAGINACIÓN
  // =========================
  private paginateData(data: Solicitud[]): void {
    const pageSize = this.filterForm.value.pageSize || 10;

    this.totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);

    const start = (this.currentPage - 1) * pageSize;
    this.pagedItems = data.slice(start, start + pageSize);
  }

  private syncCategorias(): void {
    this.categorias = Array.from(
      new Set(this.items.map(item => item.categoria).filter(Boolean))
    );
  }

  private patchItemEstado(id: number, estado: Solicitud['estado']): void {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, estado } : item
    );

    this.applyAll();
  }

  private runQuickAction(
    id: number,
    request$: Observable<string>,
    estado: Solicitud['estado'],
    successMessage: string,
    errorMessage: string
  ): void {
    this.processingIds.add(id);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.processingIds.delete(id))
      )
      .subscribe({
        next: () => {
          this.patchItemEstado(id, estado);
          this.alert.show(successMessage, 'success');
        },
        error: () => this.alert.show(errorMessage, 'error')
      });
  }

  setPage(n: number): void {
    if (n < 1 || n > this.totalPages) return;

    this.currentPage = n;
    this.applyAll();
  }

  // =========================
  // ACCIONES
  // =========================
  goToDetail(item: Solicitud): void {
    this.router.navigate(['/solicitudes', item.id], {
      state: { item }
    });
  }

  goToCreate(): void {
    this.router.navigate(['solicitudes', 'nuevo']);
  }

  async approveQuick(id: number): Promise<void> {
    if (this.processingIds.has(id)) return;

    const ok = await this.confirm.confirm('¿Confirmas aprobar esta solicitud?');
    if (!ok) return;

    this.runQuickAction(
      id,
      this.service.aprobar(id),
      'Aprobada',
      'Solicitud aprobada',
      'Error al aprobar'
    );
  }

  async rejectQuick(id: number): Promise<void> {
    if (this.processingIds.has(id)) return;

    const ok = await this.confirm.confirm('¿Confirmas rechazar esta solicitud?');
    if (!ok) return;

    this.runQuickAction(
      id,
      this.service.rechazar(id),
      'Rechazada',
      'Solicitud rechazada',
      'Error al rechazar'
    );
  }

  trackById(index: number, item: Solicitud): number {
    return item.id;
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      estado: '',
      categoria: '',
      fechaFrom: '',
      fechaTo: '',
      sortField: '',
      sortDir: 'asc',
      pageSize: 10
    });
  }
}