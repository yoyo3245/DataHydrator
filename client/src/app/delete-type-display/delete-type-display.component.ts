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
    var forbiddenId1 = "39d802c5-4dfb-4773-9860-11207fc01ff8";
    var forbiddenId2 = "871df559-4248-4fbd-b89e-827582ed656c";

    // if (this.id.trim() == forbiddenId1 || this.id.trim() == forbiddenId2) {
    //   this.setMessage('Cannot Delete "Region" or "Site"', true);
    //   return; 
    // }
    
    this.http.delete<LocationResponse>('http://localhost:5290/api/locations/types/' + this.id, { observe: 'response' }).subscribe({
      next: (response) => {
          const locationData = response.body as LocationResponse;
          this.location = locationData;
          this.setMessage(`Location type '${locationData.name}' (ID: ${locationData.id}) has been successfully deleted.`, false);
          
      },
      error: (error: HttpErrorResponse) => {
          console.log(error.error.error);
          if (error.error.error)
          {
            this.setMessage(error.error.error, true);
          }
          else 
          {
            this.setMessage('Location Type Not Found', true);
          }
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