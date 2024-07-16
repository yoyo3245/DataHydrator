import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  locations: any[] = []; // Initialize as an empty array
  loading: boolean = true;
  displayedColumns: string[] = ['id', 'location_code', 'name', 'description', 'inventory_location', 'region', 'site', 'parent_id']

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    const req = new HttpRequest('GET', 'http://localhost:5290/api/locations', {
      reportProgress: true,
      responseType: 'json'
    });

    this.http.request(req).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.DownloadProgress) {
        } else if (event instanceof HttpResponse) {
          this.locations = event.body; 
        }
      },
      error: (error) => {
        console.log(error); 
      },
      complete: () => {
        console.log('Request has completed'); 
      }
    });
  }
}
