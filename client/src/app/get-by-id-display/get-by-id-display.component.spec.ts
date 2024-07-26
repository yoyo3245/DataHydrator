import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { GetByIdDisplayComponent } from './get-by-id-display.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoaderService } from '../loader/loader.service';
import { By } from '@angular/platform-browser';

describe('GetByIdDisplayComponent', () => {
  let component: GetByIdDisplayComponent;
  let fixture: ComponentFixture<GetByIdDisplayComponent>;
  let httpTestingController: HttpTestingController;
  let loaderService: LoaderService;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      declarations: [GetByIdDisplayComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        MatFormFieldModule, 
        MatInputModule, 
        BrowserAnimationsModule, 
        FormsModule
      ]
    });
    fixture = TestBed.createComponent(GetByIdDisplayComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    loaderService = TestBed.inject(LoaderService) as LoaderService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when fields are empty', () => {  
    component.getData();
 
    expect(component.errorMessage).toBe('Bad Request');
     
    fixture.detectChanges();
 
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('Bad Request');
  });

  it('should display error message when location not found', () => {
    const testId = '00000000-0000-0000-0000-000000000000';

    component.id = testId;
    fixture.detectChanges();

    // Simulate the HTTP request
    component.getData();

    // Mock the HTTP response for the get request
    const req = httpTestingController.expectOne(`http://localhost:5290/api/locations/${testId}`);
    req.flush(null, { status: 404, statusText: 'Not Found' });

    // Assert the component's state after the HTTP response
    expect(component.errorMessage).toBe('Location Not Found');
    
    // Detect changes in the fixture to apply changes to the DOM
    fixture.detectChanges();

    // Assert the presence and text content of the error message element
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('Location Not Found');
  });

  it('should display location details when location is found', fakeAsync(() => {
    const testId = '00000000-0000-0000-0000-000000000000';
    
    // Set the test ID
    component.id = testId;
    fixture.detectChanges();
    
    // Trigger the getData method (simulating button click)
    component.getData();
    
    // Mock the successful HTTP response for the get request
    const mockResponse = {
      id: testId,
      name: 'Location Name',
      description: 'Location Description',
      location_code: 'Location Code',
      parent_id: 'Parent ID'
    };
    
    const req = httpTestingController.expectOne(`http://localhost:5290/api/locations/${testId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse); // Flush the response with the mock data
    
    // Simulate the passage of time until all pending asynchronous activities are resolved
    tick();
    fixture.detectChanges();
    
    // Assert the component's state after the HTTP response
    expect(component.errorMessage).toBe('');
    
    // Assert the presence and correctness of displayed location data in the DOM
    const locationDetailDiv = fixture.debugElement.query(By.css('.custom-margin'));
    expect(locationDetailDiv).toBeTruthy();
    
    // Assert the content of each location detail
    expect(locationDetailDiv.nativeElement.textContent).toContain(`ID: ${mockResponse.id}`);
    expect(locationDetailDiv.nativeElement.textContent).toContain(`Name: ${mockResponse.name}`);
    expect(locationDetailDiv.nativeElement.textContent).toContain(`Description: ${mockResponse.description}`);
    expect(locationDetailDiv.nativeElement.textContent).toContain(`Location Code: ${mockResponse.location_code}`);
    expect(locationDetailDiv.nativeElement.textContent).toContain(`Parent Id: ${mockResponse.parent_id}`);
     
  }));
  
}); 
