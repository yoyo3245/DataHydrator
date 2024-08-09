import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-type-display',
  templateUrl: './create-type-display.component.html',
  styleUrls: ['./create-type-display.component.css']
})
export class CreateTypeDisplayComponent{
  type: any;
  errorMessage: string | null = null; 
  name: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient) {}

  createData() {
    const body = {
      "Name": this.name
    };

    this.http.post<any>('http://localhost:5290/api/locations/types', body)
      .subscribe(
        response => {
          this.type = response;
          console.log('POST request successful!', this.type);
          this.errorMessage = null; 
          this.successMessage = `Location Type ID ${this.type.id} has been successfully Created.`;
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = 'Please fill in field correctly.'; 
          this.successMessage = null;
          console.error('Error:', error);
        }
      );


      
  }
}
