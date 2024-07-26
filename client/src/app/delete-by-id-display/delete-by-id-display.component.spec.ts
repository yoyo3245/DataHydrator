import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteByIdDisplayComponent } from './delete-by-id-display.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderService } from '../loader/loader.service';
import { By } from '@angular/platform-browser';

describe('DeleteByIdDisplayComponent', () => {
  let component: DeleteByIdDisplayComponent;
  let fixture: ComponentFixture<DeleteByIdDisplayComponent>;
  let httpTestingController: HttpTestingController;
  let loaderService: LoaderService;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      declarations: [DeleteByIdDisplayComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule, // Replace HttpTestingController with HttpClientTestingModule
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatInputModule,
        FormsModule
      ],
      providers: [
        LoaderService // Mock or spy LoaderService as needed
      ]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    loaderService = TestBed.inject(LoaderService) as LoaderService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteByIdDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that there are no outstanding HTTP requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when fields are empty', () => {  
    component.deleteData();
 
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
    component.deleteData();

    // Mock the HTTP response for the delete request
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

  it('should display success message when location is found', () => {
    const testId = '00000000-0000-0000-0000-000000000000';

    component.id = testId;
    fixture.detectChanges();

    // Simulate the HTTP request
    component.deleteData();

    // Mock the successful HTTP response for the delete request
    const mockResponse = 
    {
      "id": `${testId}`,
      "location_code": "Tester1",
      "name": "Tester name",
      "description": "Tester1 description",
      "inventory_location": false,
      "region": 0,
      "site": 0,
      "parent_id": "00000000-0000-0000-0000-000000000000"
    }; 

    const req = httpTestingController.expectOne(`http://localhost:5290/api/locations/${testId}`);
    req.flush(mockResponse); // Flush the response with the mock data

    // Assert the component's state after the HTTP response
    expect(component.errorMessage).toBe("");
    
    // Detect changes in the fixture to apply changes to the DOM
    fixture.detectChanges();

    // Assert the presence and text content of the error message element
    const successMessageElement = fixture.debugElement.query(By.css('.success-message'));
    expect(successMessageElement).not.toBeNull();
    expect(successMessageElement.nativeElement.textContent.trim()).toBe(`Location ID ${testId} has been successfully deleted.`);
  });
});
