import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CrearSolicitudGastoDto } from '../../models/crear-solicitud.dto';
import { AlertService } from '../../../../core/alert.service';

@Component({
  selector: 'app-solicitudes-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;

  loading = false;
  editingId?: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: SolicitudesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alert: AlertService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = Number(id);
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isEditing(): boolean {
    return !!this.editingId;
  }

  get pageTitle(): string {
    return this.isEditing ? 'Editar solicitud' : 'Nueva solicitud';
  }

  get submitLabel(): string {
    if (this.loading) {
      return this.isEditing ? 'Guardando cambios...' : 'Creando solicitud...';
    }

    return this.isEditing ? 'Guardar cambios' : 'Crear solicitud';
  }

  // =========================
  // BUILD FORM
  // =========================
  buildForm(): void {
    this.form = this.fb.group({
      categoria: ['', Validators.required],
      descripcion: ['', [Validators.maxLength(500)]],
      valor: [null, [Validators.required, Validators.min(1)]],
      fechaGasto: ['', Validators.required],
      usuario: ['', Validators.required]
    });
  }

  // =========================
  // LOAD DATA (EDIT)
  // =========================
  loadData(): void {
    if (!this.editingId) return;

    this.loading = true;

    this.service.get(this.editingId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (item) => {
          this.form.patchValue({
            categoria: item.categoria,
            descripcion: item.descripcion,
            valor: item.valor,
            fechaGasto: item.fechaGasto?.split('T')[0] ?? item.fechaGasto,
            usuario: item.usuario
          });

          if (item.estado !== 'Pendiente') {
            this.form.disable();
          }
        },
        error: () => {
          this.alert.show('No fue posible cargar la solicitud', 'error');
          this.goBack();
        }
      });
  }

  // =========================
  // SUBMIT
  // =========================
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload: CrearSolicitudGastoDto = this.form.getRawValue();
    const request$: Observable<unknown> = this.editingId
      ? this.service.update(this.editingId, payload)
      : this.service.create(payload);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.alert.show(this.isEditing ? 'Solicitud actualizada' : 'Solicitud creada', 'success');
          this.router.navigate(['/solicitudes']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/solicitudes']);
  }
}