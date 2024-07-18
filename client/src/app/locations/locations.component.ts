import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  isNewestFirst: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLocations() {
    const req = new HttpRequest('GET', 'http://localhost:5290/api/locations', { 
      responseType: 'json'
    });

    this.http.request(req).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.DownloadProgress) { 
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

  toggleSortOrder() {
    this.isNewestFirst = !this.isNewestFirst;
    this.dataSource.data = this.dataSource.data.reverse();
  }
}