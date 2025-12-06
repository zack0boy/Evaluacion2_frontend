import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoletasPage } from './boletas.page';

describe('BoletasPage', () => {
  let component: BoletasPage;
  let fixture: ComponentFixture<BoletasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BoletasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
