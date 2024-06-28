import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLocationDisplayComponent } from './create-location-display.component';

describe('CreateLocationDisplayComponent', () => {
  let component: CreateLocationDisplayComponent;
  let fixture: ComponentFixture<CreateLocationDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLocationDisplayComponent]
    });
    fixture = TestBed.createComponent(CreateLocationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
