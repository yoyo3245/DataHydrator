import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-location-display',
  templateUrl: './create-location-display.component.html',
  styleUrls: ['./create-location-display.component.css']
})
export class CreateLocationDisplayComponent {
  location: any;
  errorMessage: string | null = null; 
  
  locationCode: string | null = null;
  name: string | null = null;
  description: string | null = null;
  region: number | null = null;
  site: number | null = null;
  inventoryLocation: boolean = false;
  parentId: string | null = null;

  constructor(private http: HttpClient) {}

  createData() {
    const body = {
      "LocationCode": this.locationCode,
      "Name": this.name,
      "Description": this.description,
      "Region": this.region,
      "Site": this.site,
      "InventoryLocation": this.inventoryLocation,
      "ParentId": this.parentId
    };

    this.http.post<any>('http://localhost:5290/api/locations/', body)
      .subscribe(
        response => {
          this.location = response;
          console.log('POST request successful!', this.location);
          this.errorMessage = null; 
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorMessage = 'Bad Request'; 
          } else {
            this.errorMessage = 'An Error Occurred'; 
          }
          this.location = null;
          console.error('Error:', error);
        }
      );
  }
}
