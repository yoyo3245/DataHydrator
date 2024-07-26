import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateLocationDisplayComponent } from './create-location-display.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('CreateLocationDisplayComponent', () => {
  let component: CreateLocationDisplayComponent;
  let fixture: ComponentFixture<CreateLocationDisplayComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      declarations: [CreateLocationDisplayComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        FormsModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLocationDisplayComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when fields are empty', fakeAsync(() => {
    // Trigger form submission
    component.createData();

    // Mock the HTTP response for the create request
    const req = httpTestingController.expectOne('http://localhost:5290/api/locations/');
    req.flush(null, { status: 400, statusText: 'Bad Request'});
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
    component.createData();

    const req = httpTestingController.expectOne('http://localhost:5290/api/locations/');
    expect(req.request.method).toEqual('POST');

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

  it('should display success message when location is created', fakeAsync(() => {
    const testId = '00000000-0000-0000-0000-000000000000';
    // Simulate an HTTP POST request that responds with a non-400 error (e.g., 500 Internal Server Error)
    component.createData();

    const req = httpTestingController.expectOne('http://localhost:5290/api/locations/');
    expect(req.request.method).toEqual('POST');

    // Mock a non-400 error response
    req.flush({ id: `${testId}` });

    // Update the view
    fixture.detectChanges();
    tick(); // Wait for async operations to complete 

    // Check if the error message is displayed in the template
    const successMessageElement = fixture.debugElement.query(By.css('.success-message'));
    expect(successMessageElement).not.toBeNull();
    expect(successMessageElement.nativeElement.textContent.trim()).toBe(`Location ID ${testId} has been successfully Created.`);
  }));
});
