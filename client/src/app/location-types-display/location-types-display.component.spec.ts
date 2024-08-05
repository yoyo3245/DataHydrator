import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTypesDisplayComponent } from './location-types-display.component';

describe('LocationTypesDisplayComponent', () => {
  let component: LocationTypesDisplayComponent;
  let fixture: ComponentFixture<LocationTypesDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationTypesDisplayComponent]
    });
    fixture = TestBed.createComponent(LocationTypesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
