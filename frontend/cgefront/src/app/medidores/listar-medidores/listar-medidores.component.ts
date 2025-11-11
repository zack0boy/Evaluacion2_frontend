import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-medidores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-medidores.component.html',
  styleUrls: ['./listar-medidores.component.scss']
})
export class ListarMedidoresComponent {
  busqueda: string = '';
  medidores: any[] = [];

  filtrarMedidores(): void {
    // implement filtering logic as needed; placeholder keeps existing list
    const termino = this.busqueda?.toLowerCase().trim();
    if (!termino) {
      // restore or keep full list as appropriate
      return;
    }
    this.medidores = this.medidores.filter(m =>
      String(m.codigo_medidor).toLowerCase().includes(termino) ||
      String(m.cliente?.nombre_razon).toLowerCase().includes(termino)
    );
  }

  crearMedidor(): void {
    // open modal or navigate to create form
    console.log('crearMedidor called');
  }

  editarMedidor(id: any): void {
    // open modal or navigate to edit form
    console.log('editarMedidor called for', id);
  }

  eliminarMedidor(id: any): void {
    // confirm and delete
    console.log('eliminarMedidor called for', id);
  }
}
