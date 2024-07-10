import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetByIdDisplayComponent } from './get-by-id-display.component';

describe('GetByIdDisplayComponent', () => {
  let component: GetByIdDisplayComponent;
  let fixture: ComponentFixture<GetByIdDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetByIdDisplayComponent]
    });
    fixture = TestBed.createComponent(GetByIdDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
