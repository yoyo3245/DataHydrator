import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-update-location-display',
  templateUrl: './update-location-display.component.html',
  styleUrls: ['./update-location-display.component.css']
})
export class UpdateLocationDisplayComponent {
  location: any;
  errorMessage: string | null = null; 
  
  id: any;
  locationCode: string | null = null;
  name: string | null = null;
  description: string | null = null;
  region: number | null = null;
  site: number | null = null;
  inventoryLocation: boolean | null = null;
  parentId: string | null = null;

  constructor(private http: HttpClient) {}

  updateData(){
    const body: any = {}; // Initialize empty body object

    if (this.locationCode !== null) {
      body.LocationCode = this.locationCode;
    }
    if (this.name !== null) {
      body.Name = this.name;
    }
    if (this.description !== null) {
      body.Description = this.description;
    }
    if (this.region !== null) {
      body.Region = this.region;
    }
    if (this.site !== null) {
      body.Site = this.site;
    }
    if (this.inventoryLocation !== null) {
      body.InventoryLocation = this.inventoryLocation;
    }
    if (this.parentId !== null) {
      body.ParentId = this.parentId;
    }

    this.http.put<any>('http://localhost:5290/api/locations/' + this.id, body)
      .subscribe(
        response => {
          this.location = response; 
          this.errorMessage = null;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorMessage = 'Please fill in all fields correctly.'; 
          } else {
            this.errorMessage = 'An Error Occurred'; 
          }
          this.location = null; 
        }
      );
  }
}
