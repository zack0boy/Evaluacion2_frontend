import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBoletaComponent } from './boleta-detail.component';

describe('BoletaDetailComponent', () => {
  let component: DetailBoletaComponent;
  let fixture: ComponentFixture<DetailBoletaComponent>;     
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailBoletaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
