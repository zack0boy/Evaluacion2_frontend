export interface Registro {
  id_registro?: string;
  tipo: string; // 'lectura' o 'boleta'
  descripcion: string;  
  operador: string;
  fecha_registro: string; // timestamp
  id_objeto?: number; // id del elemento relacionado (lectura/boleta)
}