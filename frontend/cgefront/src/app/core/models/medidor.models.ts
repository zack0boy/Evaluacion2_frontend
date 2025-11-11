export interface Medidor {
  id_medidor?: string;
  codigo_medidor: string;
  id_cliente: string;
  direccion_suministro?: string;
  estado?: 'activo'|'inactivo';
  created_at?: string;
  updated_at?: string;
}
