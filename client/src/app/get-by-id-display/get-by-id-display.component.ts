import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-get-by-id-display',
  templateUrl: './get-by-id-display.component.html',
  styleUrls: ['./get-by-id-display.component.css']
})
export class GetByIdDisplayComponent {

  id:String = '';
  location: any;
  errorMessage: String = '';
  
  constructor(private http:HttpClient){}
  
  getData() {
    if (this.id.length === 0) {
      this.errorMessage = 'Bad Request';
      return; 
    }
    this.http.get('http://localhost:5290/api/locations/' + this.id).subscribe({
      next: (response: any) => {
        this.location = response;
        this.errorMessage = ''; 
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = 'Location Not Found'; 
        } else {
          this.errorMessage = 'An Error Occurred'; 
        }
        this.location = null;
        console.error('Error:', error);
      }
    });
  }
}
