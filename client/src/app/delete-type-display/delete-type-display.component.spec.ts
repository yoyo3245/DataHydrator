import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeDisplayComponent } from './delete-type-display.component';

describe('DeleteTypeDisplayComponent', () => {
  let component: DeleteTypeDisplayComponent;
  let fixture: ComponentFixture<DeleteTypeDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTypeDisplayComponent]
    });
    fixture = TestBed.createComponent(DeleteTypeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
