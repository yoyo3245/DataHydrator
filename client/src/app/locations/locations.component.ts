import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'location_code', 'name', 'description', 'inventory_location', 'region', 'site', 'parent_id'];
  dataSource = new MatTableDataSource([]);
  resultsLength = 0;
  isNewestFirst = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  errorMessage = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.onPageChange(event);
    });
  }

  loadData() {
    const url = `http://localhost:5290/api/locations/items?page=${this.currentPage}&pageLength=${this.pageSize}&isNewestFirst=${this.isNewestFirst}`;
    
    this.http.get<any>(url).subscribe(
      (response) => {
        this.dataSource.data = response.page_data;
        this.resultsLength = response.total_count;
        this.errorMessage = "";
        this.calculatePageInfo();
      },
      (error) => { 
        this.errorMessage = "An Error Occurred"; 
      }
    );
  }

  calculatePageInfo() {
    this.totalPages = Math.ceil(this.resultsLength / this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  toggleSortOrder() {
    this.isNewestFirst = !this.isNewestFirst;
    this.currentPage = 1;
    this.loadData();
    this.resetPaginator();
  }

  resetPaginator() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator.page.emit({
        pageIndex: 0,
        pageSize: this.pageSize,
        length: this.resultsLength
      });
    }
  }
}
