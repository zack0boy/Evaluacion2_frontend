export interface Cliente {
  id_cliente?: string;
  rut: string;
  nombre_razon: string;
  email_contacto?: string;
  telefono?: string;
  direccion_facturacion?: string;
  estado?: 'activo' | 'inactivo';
  created_at?: string;
  updated_at?: string;
}
