import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LocationsComponent } from './locations.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoaderService } from '../loader/loader.service';
import { By } from '@angular/platform-browser';

describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;
  let httpTestingController: HttpTestingController;
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [LocationsComponent],
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        MatFormFieldModule,
        BrowserAnimationsModule, 
        MatInputModule, 
        FormsModule, 
        MatIconModule, 
        MatPaginatorModule,
        MatTableModule
      ]
    });
    fixture = TestBed.createComponent(LocationsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    loaderService = TestBed.inject(LoaderService) as LoaderService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when locations not loaded', () => {  
    
    const req = httpTestingController.expectOne(`http://localhost:5290/api/locations/items?page=1&pageLength=10&isNewestFirst=false`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
 
    expect(component.errorMessage).toBe('An Error Occurred');
     
    fixture.detectChanges();
 
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('An Error Occurred');
  });

  it('should display locations when loaded', fakeAsync(() => {
    const mockResponse = {
      "total_count": 1,
      "page_data": [
        {
          "id": "1ccabb1c-e2cd-4418-8e00-3b0f54a51555",
          "location_code": "Child level61 - 32",
          "name": "Child level61 name - 32",
          "description": "Child level61 description - 32",
          "inventory_location": false,
          "region": 0,
          "site": 0,
          "parent_id": "bcff7990-b69c-4f53-be7f-21c23532a70e"
        }
      ],
      "page": 1,
      "page_length": 10
    };

    // Trigger ngOnInit and initial data load
    fixture.detectChanges();

    // Expect one HTTP request for the specified URL
    const req = httpTestingController.expectOne(`http://localhost:5290/api/locations/items?page=1&pageLength=10&isNewestFirst=false`);
    expect(req.request.method).toEqual('GET');

    // Respond with mock data
    req.flush(mockResponse);

    // Simulate the passage of time until all pending asynchronous activities are resolved
    tick();
    fixture.detectChanges();

    // Log component state and rendered HTML
    console.log('Component state:', component);
    console.log('Rendered HTML:', fixture.nativeElement.innerHTML);

    // Assert that there is no error message displayed
    expect(component.errorMessage).toBe('');

    // Assert the presence and correctness of displayed location data in the table rows
    const tableRows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    console.log('Table rows:', tableRows);
    expect(tableRows.length).toBe(1, 'Expected one table row');

    if (tableRows.length > 0) {
      const locationCells = tableRows[0].querySelectorAll('td');
      console.log('Location cells:', locationCells);
      expect(locationCells.length).toBe(8, 'Expected 8 cells in the row');

      // Assert the content of each cell
      if (locationCells.length === 8) {
        expect(locationCells[0].textContent.trim()).toBe('1ccabb1c-e2cd-4418-8e00-3b0f54a51555', 'Incorrect ID');
        expect(locationCells[1].textContent.trim()).toBe('Child level61 - 32', 'Incorrect Location Code');
        expect(locationCells[2].textContent.trim()).toBe('Child level61 name - 32', 'Incorrect Name');
        expect(locationCells[3].textContent.trim()).toBe('Child level61 description - 32', 'Incorrect Description');
        expect(locationCells[4].textContent.trim()).toBe('false', 'Incorrect Inventory Location');
        expect(locationCells[5].textContent.trim()).toBe('0', 'Incorrect Region');
        expect(locationCells[6].textContent.trim()).toBe('0', 'Incorrect Site');
        expect(locationCells[7].textContent.trim()).toBe('bcff7990-b69c-4f53-be7f-21c23532a70e', 'Incorrect Parent ID');
      }
    } 
  }));
  

});
