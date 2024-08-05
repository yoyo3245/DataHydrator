import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTypeDisplayComponent } from './create-type-display.component';

describe('CreateTypeDisplayComponent', () => {
  let component: CreateTypeDisplayComponent;
  let fixture: ComponentFixture<CreateTypeDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTypeDisplayComponent]
    });
    fixture = TestBed.createComponent(CreateTypeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
