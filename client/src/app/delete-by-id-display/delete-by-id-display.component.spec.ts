import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteByIdDisplayComponent } from './delete-by-id-display.component';

describe('DeleteByIdDisplayComponent', () => {
  let component: DeleteByIdDisplayComponent;
  let fixture: ComponentFixture<DeleteByIdDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteByIdDisplayComponent]
    });
    fixture = TestBed.createComponent(DeleteByIdDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
