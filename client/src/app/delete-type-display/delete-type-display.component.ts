import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

interface LocationResponse {
  id?: string;
  name?: string;
  error?: string;
}

@Component({
  selector: 'app-delete-type-display',
  templateUrl: './delete-type-display.component.html',
  styleUrls: ['./delete-type-display.component.css']
})
export class DeleteTypeDisplayComponent {
  id: string = '';
  location: LocationResponse | null = null;
  message: string = '';
  isError: boolean = false;
  
  constructor(private http: HttpClient) {}
  
  deleteData() {
    this.resetMessages();
    this.id = this.id.trim();
    
    if (this.id.length === 0) {
      this.setMessage('Bad Request', true);
      return; 
    }
    
    this.http.delete<LocationResponse>('http://localhost:5290/api/locations/types/' + this.id, { observe: 'response' }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          const locationData = response.body as LocationResponse;
          if (locationData.error) {
            this.setMessage(locationData.error, true);
          } else {
            this.location = locationData;
            this.setMessage(`Location type '${locationData.name}' (ID: ${locationData.id}) has been successfully deleted.`, false);
          }
        } else if (response.status === 404) {
          this.setMessage('Location type not found', true);
        }
      },
      error: (error: HttpErrorResponse) => {
          this.setMessage('Location type not found', true);
      }
    });
  }

  private resetMessages() {
    this.message = '';
    this.isError = false;
    this.location = null;
  }

  private setMessage(message: string, isError: boolean) {
    this.message = message;
    this.isError = isError;
  }
}