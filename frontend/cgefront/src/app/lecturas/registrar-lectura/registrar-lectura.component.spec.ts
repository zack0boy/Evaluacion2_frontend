import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarLecturaComponent } from './registrar-lectura.component';

describe('RegistrarLecturaComponent', () => {
  let component: RegistrarLecturaComponent;
  let fixture: ComponentFixture<RegistrarLecturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarLecturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarLecturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
