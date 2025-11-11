import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMedidoresComponent } from './listar-medidores.component';

describe('ListarMedidoresComponent', () => {
  let component: ListarMedidoresComponent;
  let fixture: ComponentFixture<ListarMedidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarMedidoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarMedidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
