export interface Solicitud {
  id: number;
  categoria: string;
  descripcion?: string;
  valor: number;
  fechaGasto: string;
  usuario: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | string;
  fechaDecision?: string | null;
  // Otros campos posibles según la API
}
