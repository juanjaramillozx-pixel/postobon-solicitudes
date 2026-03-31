export interface CrearSolicitudGastoDto {
  categoria: string;
  descripcion?: string;
  valor: number;
  fechaGasto: string; // ISO date
  usuario: string;
}
