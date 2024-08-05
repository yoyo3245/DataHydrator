import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoaderService } from '../loader/loader.service';
import { delay, timeout } from 'rxjs';

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
  childId: string = '';

  total: number = 0;
  progress: number = 0;

  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  async hydrator() {
    this.errorMessage = null;
    this.successMessage = null;

    // Validate inputs before proceeding
    if (!this.nameFormat || isNaN(parseInt(this.entries)) || isNaN(parseInt(this.childDepth)) || this.entries <= 0 || this.childDepth < 0) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    // Calculate total number of operations to be performed
    this.total = parseInt(this.entries) + parseInt(this.entries) * parseInt(this.childDepth);
    this.progress = 0;
    console.log("total: " + this.total)
    // Start hydration process
    this.loaderService.setHydrator(true);

    try {
      // Outer loop for creating parent locations
      for (let index = 1; index <= this.entries; index++) {
        const body = {
          "LocationCode": `${this.nameFormat}${index}`,
          "Name": `${this.nameFormat} name`,
          "Description": `${this.nameFormat}${index} description`,
          "LocationId": "39d802c5-4dfb-4773-9860-11207fc01ff8",
          "InventoryLocation": false,
          "ParentId": `00000000-0000-0000-0000-000000000000`
        };

        const response = await this.http.post<any>('http://localhost:5290/api/locations/', body).toPromise();
        const parentLocation = response.id;
        console.log('POST request successful for parent:', response);
        this.errorMessage = null;

        // Update progress after each parent creation 
        this.progress++;
        this.loaderService.setProgress((this.progress / this.total) * 100);
        console.log((this.progress / this.total) * 100)
        // Inner loop for creating child locations
        await this.createChildLocations(parentLocation, index);
      } 
      this.successMessage = 'Successfully Created Parent Location(s) and Child Location(s)';
    } catch (error) {
      this.errorMessage = 'An Error Occurred';
      console.error('Error:', error);
    } finally {
      // End hydration process
      
      this.loaderService.setProgress(0);  
      this.loaderService.setHydrator(false);
    }
  }

  async createChildLocations(parentLocation: string, index: number) {
    if (!this.childDepth) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    try {
      // Inner loop for creating child locations
      for (let level = 1; level <= this.childDepth; level++) {
        const childBody = {
          "LocationCode": `Child level${level} - ${index}`,
          "Name": `Child level${level} name - ${index}`,
          "Description": `Child level${level} description - ${index}`,
          "LocationId": "871df559-4248-4fbd-b89e-827582ed656c",
          "InventoryLocation": false,
          "ParentId": '' // Initialize with an empty string or appropriate default value
        } as { [key: string]: any }; // Type assertion to allow any property

        if (level === 1) {
          childBody["ParentId"] = parentLocation;
        } else {
          childBody["ParentId"] = this.childId;
        }

        const response = await this.http.post<any>('http://localhost:5290/api/locations/', childBody).toPromise();
        console.log('POST request successful for child:', response);
        this.childId = response.id;

        // Update progress after each child creation
        this.progress++;
        this.loaderService.setProgress((this.progress / this.total) * 100);
        console.log((this.progress / this.total) * 100)
      }
    } catch (error) {
      this.errorMessage = 'An Error Occurred';
      console.error('Error:', error);
    }
  }
}
