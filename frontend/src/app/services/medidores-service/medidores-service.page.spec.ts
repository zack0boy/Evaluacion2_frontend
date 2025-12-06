import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedidoresServicePage } from './medidores-service.page';

describe('MedidoresServicePage', () => {
  let component: MedidoresServicePage;
  let fixture: ComponentFixture<MedidoresServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidoresServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
