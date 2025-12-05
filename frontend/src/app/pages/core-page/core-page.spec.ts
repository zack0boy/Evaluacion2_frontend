import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorePage } from './core-page';

describe('CorePage', () => {
  let component: CorePage;
  let fixture: ComponentFixture<CorePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
