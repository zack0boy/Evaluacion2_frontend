import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MedidoresService, Medidor } from '../../services/medidores-service/medidores-service';
@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.page.html',
  styleUrls: ['./medidores.page.scss'],
})
export class MedidoresPage implements OnInit {

  medidores: Medidor[] = [];
  medidor: any = {}; // para formulario
  modoEdicion = false;
  cargando = false;
  mensajeError = '';

  constructor(
    private medidoresService: MedidoresService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.cargarMedidores();
  }

  cargarMedidores() {
    this.cargando = true;
    this.medidoresService.listar().subscribe({
      next: data => {
        this.medidores = data;
        this.cargando = false;
      },
      error: err => {
        this.showToast('Error cargando medidores', 'danger');
        this.cargando = false;
      }
    });
  }

  buscarClientePorRut() {
    // Solo validación simple
    if (this.medidor.rut_cliente) {
      const rut = this.medidor.rut_cliente.replace(/\./g, "").replace("-", "");
      if (!/^[0-9]+[0-9kK]$/.test(rut)) {
        this.mensajeError = 'RUT inválido';
      } else {
        this.mensajeError = '';
      }
    }
  }

  guardar() {
    if (this.mensajeError) return;

    this.cargando = true;
    if (this.modoEdicion) {
      this.medidoresService.actualizar(this.medidor.id_medidor, this.medidor).subscribe({
        next: () => {
          this.showToast('Medidor actualizado', 'success');
          this.resetFormulario();
          this.cargarMedidores();
        },
        error: err => {
          this.showToast(err.error.detail || 'Error al actualizar', 'danger');
          this.cargando = false;
        }
      });
    } else {
      this.medidoresService.crear(this.medidor).subscribe({
        next: () => {
          this.showToast('Medidor creado', 'success');
          this.resetFormulario();
          this.cargarMedidores();
        },
        error: err => {
          this.showToast(err.error.detail || 'Error al crear', 'danger');
          this.cargando = false;
        }
      });
    }
  }

  editarMedidor(m: Medidor) {
    this.modoEdicion = true;
    this.medidor = { ...m, rut_cliente: m.cliente?.rut || '' };
    window.scrollTo(0, 0);
  }

  eliminarMedidor(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este medidor?')) return;
    this.medidoresService.eliminar(id).subscribe({
      next: () => {
        this.showToast('Medidor eliminado', 'success');
        this.cargarMedidores();
      },
      error: err => {
        this.showToast(err.error.detail || 'Error al eliminar', 'danger');
      }
    });
  }

  cancelar() {
    this.resetFormulario();
  }

  resetFormulario() {
    this.medidor = {};
    this.modoEdicion = false;
    this.cargando = false;
    this.mensajeError = '';
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({
      message: msg,
      duration: 1800,
      color
    });
    t.present();
  }
}
