import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetByIdDisplayComponent } from './get-by-id-display.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GetByIdDisplayComponent', () => {
  let component: GetByIdDisplayComponent;
  let fixture: ComponentFixture<GetByIdDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetByIdDisplayComponent],
      imports: [HttpClientModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, FormsModule]
    });
    fixture = TestBed.createComponent(GetByIdDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
