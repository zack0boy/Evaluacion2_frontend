import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MedidoresService } from '../../services/medidores-service/medidores-service';
import { MedidoresComponent } from 'cgefront/src/app/medidores/medidores.component';
@Component({
  selector: 'app-agregar-medidor',
    templateUrl: 'medidores.html',
})
export class AgregarMedidorPage {

  form = {
    codigo_medidor: '',
    rut_cliente: '',
    direccion_suministro: '',
    estado: 'activo',
    latitud: null,
    longitud: null
  };

  constructor(
    private medidoresService: MedidoresService,
    private toast: ToastController
  ) {}

  validarRUT(rut: string) {
    rut = rut.replace(/\./g, "").replace("-", "");
    return /^[0-9]+[0-9kK]$/.test(rut);
  }

  async crear() {

    if (!this.validarRUT(this.form.rut_cliente)) {
      return this.showToast("RUT inválido", "danger");
    }

    this.medidoresService.crear(this.form).subscribe({
      next: async () => {
        this.showToast("Medidor creado", "success");
      },
      error: async err => {
        this.showToast(err.error.detail || "Error", "danger");
      }
    });
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({
      message: msg,
      duration: 1800,
      color,
    });
    t.present();
  }
}
