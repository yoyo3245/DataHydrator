import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UpdateLocationDisplayComponent } from './update-location-display.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from '../loader/loader.service';
import { By } from '@angular/platform-browser';

describe('UpdateLocationDisplayComponent', () => {
  let component: UpdateLocationDisplayComponent;
  let fixture: ComponentFixture<UpdateLocationDisplayComponent>;
  let httpTestingController: HttpTestingController; 
  let loaderService: LoaderService;

  beforeEach(async () => { 
    await TestBed.configureTestingModule({
    declarations: [UpdateLocationDisplayComponent],
    imports: [
      HttpClientTestingModule,
      MatFormFieldModule,
      MatInputModule,
      MatSlideToggleModule,
      MatButtonModule,
      FormsModule,
      BrowserAnimationsModule
    ] // Ensure LoaderService is provided here if needed
  }).compileComponents();

  fixture = TestBed.createComponent(UpdateLocationDisplayComponent);
  component = fixture.componentInstance;
  httpTestingController = TestBed.inject(HttpTestingController);
  fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP requests
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when fields are empty', fakeAsync(() => {
    // Trigger form submission
    component.updateData();

    fixture.detectChanges();

    // Mock the HTTP response for the create request
    const req = httpTestingController.expectOne(`http://localhost:5290/api/locations/${undefined}`);
    req.flush(null, { status: 400, statusText: 'Bad Request'});

    fixture.detectChanges();

    // Expect error message to be set
    expect(component.errorMessage).toBe('Please fill in all fields correctly.');

    // Update the view
    fixture.detectChanges();
    tick(); // Wait for async operations to complete

    // Check if the error message is displayed in the template
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('Please fill in all fields correctly.');
  })); 


  it('should display error message for non-400 errors', fakeAsync(() => {
    // Simulate an HTTP POST request that responds with a non-400 error (e.g., 500 Internal Server Error)
    component.updateData();

    const req = httpTestingController.expectOne(`http://localhost:5290/api/locations/${undefined}`);
    expect(req.request.method).toEqual('PUT');

    // Mock a non-400 error response
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    // Update the view
    fixture.detectChanges();
    tick(); // Wait for async operations to complete

    // Expect error message to be set to "An Error Occurred"
    expect(component.errorMessage).toBe('An Error Occurred');

    // Check if the error message is displayed in the template
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('An Error Occurred');
  }));

  it('should display success message when location is updated', fakeAsync(() => {
    const testId = '00000000-0000-0000-0000-000000000000';
    component.id = testId;
    // Simulate an HTTP POST request that responds with a non-400 error (e.g., 500 Internal Server Error)
    component.updateData();

    const req = httpTestingController.expectOne( `http://localhost:5290/api/locations/${testId}`);
    expect(req.request.method).toEqual('PUT'); 

    req.flush({ id: `${testId}` });

    // Update the view
    fixture.detectChanges();
    tick(); // Wait for async operations to complete 

    // Check if the error message is displayed in the template
    const successMessageElement = fixture.debugElement.query(By.css('.success-message'));
    expect(successMessageElement).not.toBeNull();
    expect(successMessageElement.nativeElement.textContent.trim()).toBe(`Location ID ${testId} has been successfully updated.`);
  }));
});
