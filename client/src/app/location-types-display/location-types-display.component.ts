import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-location-types-display',
  templateUrl: './location-types-display.component.html',
  styleUrls: ['./location-types-display.component.css']
})
export class LocationTypesDisplayComponent {
  displayedColumns: string[] = ['id','name'];
  dataSource = new MatTableDataSource([]);
  resultsLength = 0;
  isNewestFirst = false;
  sortAlphabetically = false;
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
    const url = `http://localhost:5290/api/locations/types/items?page=${this.currentPage}&pageLength=${this.pageSize}&isNewestFirst=${this.isNewestFirst}&sortAlphabetically=${this.sortAlphabetically}`;
    
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
