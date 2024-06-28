import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-data-hydrator',
  templateUrl: './data-hydrator.component.html',
  styleUrls: ['./data-hydrator.component.css']
})
export class DataHydratorComponent {
  nameFormat: any = '';
  entries: any | null = null;
  childDepth: any | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  childId: string = ''

  constructor(private http: HttpClient) {}

  hydrator() {
    this.errorMessage = null; // Reset error message
    this.successMessage = null; // Reset success message

    // Validate inputs before proceeding
    if (!this.nameFormat || isNaN(parseInt(this.entries)) || isNaN(parseInt(this.childDepth))|| this.entries <= 0 || this.childDepth < 0) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    // Proceed with API calls and data processing
    for (let index = 1; index <= this.entries; index++) {
      const body = {
        "LocationCode": `${this.nameFormat}${index}`,
        "Name": `${this.nameFormat} name`,
        "Description": `${this.nameFormat}${index} description`,
        "Region": 0,
        "Site": 0,
        "InventoryLocation": false,
        "ParentId": `00000000-0000-0000-0000-000000000000`
      };

      this.http.post<any>('http://localhost:5290/api/locations/', body)
        .subscribe(
          async response => {
            const parentLocation = response.id;
            console.log('POST request successful for parent:', response);
            this.errorMessage = null;

            // Example of creating child locations (adjust as per your needs)
            await this.createChildLocations(parentLocation, index);
          },
          (error: HttpErrorResponse) => {
            this.errorMessage = 'An Error Occurred - Parent'; // Handle specific errors as needed
            console.error('Error:', error);
          }
        );
    }
  }

  async createChildLocations(parentLocation: string, index: number) {
    if (!this.childDepth) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }
    try {
      for (let level = 1; level <= this.childDepth; level++) {
        const childBody: { [key: string]: any } = {
          "LocationCode": `Child level${level} - ${index}`,
          "Name": `Child level${level} name - ${index}`,
          "Description": `Child level${level} description - ${index}`,
          "Region": 0,
          "Site": 0,
          "InventoryLocation": false
        };
  
        if (level === 1) {
          childBody["ParentId"] = parentLocation;
        } else {
          childBody["ParentId"] = this.childId;
        }
  
        const response = await this.http.post<any>('http://localhost:5290/api/locations/', childBody).toPromise();
        console.log('POST request successful for child:', response);
        this.childId = response.id; // Update childId after successful POST
      }
  
      this.successMessage = 'Successfully Created Parent Location(s) and Child Location(s)';
    } catch (error) {
      this.errorMessage = 'An Error Occurred - Child';
      console.error('Error:', error);
    }
  }
  
}
