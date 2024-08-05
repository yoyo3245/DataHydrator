import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-location-display',
  templateUrl: './create-location-display.component.html',
  styleUrls: ['./create-location-display.component.css']
})
export class CreateLocationDisplayComponent implements OnInit{
  location: any;
  errorMessage: string | null = null; 
  
  locationCode: string | null = null;
  name: string | null = null;
  description: string | null = null;
  region: number | null = null;
  site: number | null = null;
  inventoryLocation: boolean = false;
  parentId: string | null = null;

  types: any;
  selectedTypeId: any | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:5290/api/locations/types')
      .subscribe(
        response => {
          this.types = response;
        },
        (error: HttpErrorResponse) => {
          this.types = [];
          console.error('Error:', error);
        }
      )
  }

  createData() {
    const body = {
      "LocationCode": this.locationCode,
      "Name": this.name,
      "Description": this.description,
      "LocationId": this.selectedTypeId,
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
            this.errorMessage = 'Please fill in all fields correctly.'; 
          } else {
            this.errorMessage = 'An Error Occurred'; 
          }
          this.location = null;
          console.error('Error:', error);
        }
      );
  }
}
