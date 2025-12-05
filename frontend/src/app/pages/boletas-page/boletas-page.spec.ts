import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletasPage } from './boletas-page';

describe('BoletasPage', () => {
  let component: BoletasPage;
  let fixture: ComponentFixture<BoletasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
