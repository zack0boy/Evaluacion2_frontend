export interface Boleta {
  id_boleta?: string;
  id_cliente: string;
  id_lectura: string;
  fecha_emision: string;
  monto_total: number;
  estado_pago: 'pagada' | 'pendiente' | 'vencida';
  fecha_vencimiento: string;
  created_at?: string;
  updated_at?: string;
}