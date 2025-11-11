import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLecturasComponent } from './listar-lecturas.component';

describe('ListarLecturasComponent', () => {
  let component: ListarLecturasComponent;
  let fixture: ComponentFixture<ListarLecturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarLecturasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarLecturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
