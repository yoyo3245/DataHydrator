import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-by-id-display',
  templateUrl: './delete-by-id-display.component.html',
  styleUrls: ['./delete-by-id-display.component.css']
})
export class DeleteByIdDisplayComponent {
  id:String = '';
  location: any;
  errorMessage: String = '';
  
  constructor(private http:HttpClient){}
  
  deleteData() {
    if (this.id.length === 0) {
      this.errorMessage = 'Bad Request';
      return; 
    }
    this.http.delete('http://localhost:5290/api/locations/' + this.id).subscribe({
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
