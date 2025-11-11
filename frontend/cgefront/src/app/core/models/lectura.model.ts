export interface Lectura {
  id_lectura?: string;
  id_cliente: string;
  fecha_lectura: string;
  consumo_kwh: number;
  tipo_lectura: 'normal' | 'estimada' | 'ajuste';
  created_at?: string;
  updated_at?: string;
}