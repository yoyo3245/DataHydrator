import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataHydratorComponent } from './data-hydrator.component';
import { LoaderService } from '../loader/loader.service';

describe('DataHydratorComponent', () => {
  let component: DataHydratorComponent;
  let fixture: ComponentFixture<DataHydratorComponent>;
  let httpTestingController: HttpTestingController;
  let loaderService: jasmine.SpyObj<LoaderService>;

  beforeEach(waitForAsync(() => {
    const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['setHydrator', 'setProgress']);

    TestBed.configureTestingModule({
      declarations: [DataHydratorComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: LoaderService, useValue: loaderServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHydratorComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    loaderService = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when fields are empty', fakeAsync(() => { 
    // Call the hydrator method
    component.hydrator(); 

    // Expect error message to be set
    expect(component.errorMessage).toBe('Please fill in all fields correctly.');

    // Check if the error message is displayed in the template
    fixture.detectChanges(); // Update the view
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('Please fill in all fields correctly.');
  }));

  it('should display error message when fields are incorrect', fakeAsync(() => {
    // Set up component properties
    component.nameFormat = 'Test';
    component.entries = '0';  
    component.childDepth = '1';  

    // Call the hydrator method
    component.hydrator(); 

    // Expect error message to be set
    expect(component.errorMessage).toBe('Please fill in all fields correctly.');

    // Check if the error message is displayed in the template
    fixture.detectChanges();  
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('Please fill in all fields correctly.');
  }));

  it('should display success message after successful hydration', fakeAsync(() => {
    console.log('Test started');
    
    // Set up component properties
    component.nameFormat = 'TestNameFormat';
    component.entries = '2';
    component.childDepth = '1';
    fixture.detectChanges();

    console.log('Component properties set');

    // Spy on the hydrator method
    spyOn(component, 'hydrator').and.callThrough();

    // Trigger hydrator method
    component.hydrator();
    console.log('Hydrator method called');

    tick();  
    console.log('First tick completed');

    // Flush the first parent request
    const req1 = httpTestingController.expectOne('http://localhost:5290/api/locations/');
    expect(req1.request.method).toEqual('POST');
    req1.flush({ id: 'parent-1' });
    console.log('First parent request flushed');

    tick();  

    // Flush the second parent request
    const req2 = httpTestingController.expectOne('http://localhost:5290/api/locations/');
    expect(req2.request.method).toEqual('POST');
    req2.flush({ id: 'parent-2' }); 

    tick();  

    // Flush the child requests
    for (let i = 0; i < 2; i++) {
      const childReq = httpTestingController.expectOne('http://localhost:5290/api/locations/');
      expect(childReq.request.method).toEqual('POST');
      childReq.flush({ id: `child-${i + 1}` }); 
      tick();  
    }
 
    fixture.detectChanges(); 

    // Expect hydrator method to have been called
    expect(component.hydrator).toHaveBeenCalled();

    // Expect success message to be set
    expect(component.successMessage).toBe('Successfully Created Parent Location(s) and Child Location(s)');

    // Check if the success message is displayed in the template
    const successMessageElement = fixture.debugElement.query(By.css('.success-message'));
    expect(successMessageElement).not.toBeNull();
    expect(successMessageElement.nativeElement.textContent.trim()).toBe('Successfully Created Parent Location(s) and Child Location(s)');

    // Verify loader service calls
    expect(loaderService.setHydrator).toHaveBeenCalledWith(true);
    expect(loaderService.setHydrator).toHaveBeenCalledWith(false);
    expect(loaderService.setProgress).toHaveBeenCalled();

    console.log('Test completed');
  }));
});