import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-type-display',
  templateUrl: './delete-type-display.component.html',
  styleUrls: ['./delete-type-display.component.css']
})
export class DeleteTypeDisplayComponent {
  id:String = '';
  location: any;
  errorMessage: String = '';
  
  constructor(private http:HttpClient){}
  
  deleteData() {
    if (this.id.length === 0) {
      this.errorMessage = 'Bad Request';
      return; 
    }
    else if (this.id == '39d802c5-4dfb-4773-9860-11207fc01ff8' || this.id == '871df559-4248-4fbd-b89e-827582ed656c') {
      this.errorMessage = 'Cannot delete "Region" or "Site"';
      return;
    }
    this.http.delete('http://localhost:5290/api/locations/types/' + this.id).subscribe({
      next: (response: any) => {
        this.location = response;
        this.errorMessage = ''; // Clear error message on successful response
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Location Not Found';
        this.location = null;
        console.error('Error:', error);
      }
    });
  }
}
