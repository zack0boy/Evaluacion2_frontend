import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarBoletasComponent } from './listar-boletas.component';

describe('ListarBoletasComponent', () => {
  let component: ListarBoletasComponent;
  let fixture: ComponentFixture<ListarBoletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarBoletasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarBoletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
