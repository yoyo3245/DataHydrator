import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-get-by-id-display',
  templateUrl: './get-by-id-display.component.html',
  styleUrls: ['./get-by-id-display.component.css']
})
export class GetByIdDisplayComponent {
  displayedColumns: string[] = ['id', 'location_code', 'name', 'description', 'inventory_location', 'location_type', 'parent_id'];
  id: string = '';
  location: any = null;
  errorMessage: string = '';
  dataSource = new MatTableDataSource<any>([]);
  type: string = '';

  constructor(private http: HttpClient) {}

  getData() {
    if (this.id.length === 0) {
      this.errorMessage = 'Bad Request';
      this.location = null;
      return; 
    }
    this.http.get<any>('http://localhost:5290/api/locations/' + this.id).subscribe({
      next: (response: any) => {
        
        this.location = response;
        this.dataSource.data = [response];
        this.errorMessage = '';
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Location Not Found';
        this.location = null;
        console.error('Error:', error);
      }
    });
  }
}
