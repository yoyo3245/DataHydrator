import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit{
  locations: any;
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.http.get('http://localhost:5290/api/locations').subscribe({
      next: response => this.locations = response,
      error: error => console.log(error),
      complete: () => console.log('Request has completed')  
    });
  }
}

