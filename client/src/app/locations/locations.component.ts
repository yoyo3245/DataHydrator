import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  loading: boolean = true;
  displayedColumns: string[] = ['id', 'location_code', 'name', 'description', 'inventory_location', 'region', 'site', 'parent_id'];
  resultsLength: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadLocations() {
    const req = new HttpRequest('GET', 'http://localhost:5290/api/locations', {
      reportProgress: true,
      responseType: 'json'
    });

    this.http.request(req).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.DownloadProgress) {
          // You can handle progress here if needed
        } else if (event instanceof HttpResponse) {
          this.dataSource.data = event.body;
          this.resultsLength = event.body.length;
          this.loading = false;
        }
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
      complete: () => {
        console.log('Request has completed');
      }
    });
  }

  onPageChange(event: PageEvent) {
    console.log('Page changed:', event);
    // Additional logic can be added here if needed
  }
}