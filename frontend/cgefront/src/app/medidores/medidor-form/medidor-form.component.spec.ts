import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidorFormComponent } from './medidor-form.component';

describe('MedidorFormComponent', () => {
  let component: MedidorFormComponent;
  let fixture: ComponentFixture<MedidorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedidorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedidorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
