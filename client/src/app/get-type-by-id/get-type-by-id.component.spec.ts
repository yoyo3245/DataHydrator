import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTypeByIdComponent } from './get-type-by-id.component';

describe('GetTypeByIdComponent', () => {
  let component: GetTypeByIdComponent;
  let fixture: ComponentFixture<GetTypeByIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetTypeByIdComponent]
    });
    fixture = TestBed.createComponent(GetTypeByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
