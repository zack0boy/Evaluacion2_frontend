import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturasPage } from './lecturas-page';

describe('LecturasPage', () => {
  let component: LecturasPage;
  let fixture: ComponentFixture<LecturasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LecturasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecturasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
