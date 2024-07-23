import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLocationDisplayComponent } from './update-location-display.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdateLocationDisplayComponent', () => {
  let component: UpdateLocationDisplayComponent;
  let fixture: ComponentFixture<UpdateLocationDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateLocationDisplayComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        FormsModule,
        BrowserAnimationsModule
      ]
    });
    fixture = TestBed.createComponent(UpdateLocationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
