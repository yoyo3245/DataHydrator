import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLocationDisplayComponent } from './update-location-display.component';

describe('UpdateLocationDisplayComponent', () => {
  let component: UpdateLocationDisplayComponent;
  let fixture: ComponentFixture<UpdateLocationDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateLocationDisplayComponent]
    });
    fixture = TestBed.createComponent(UpdateLocationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
