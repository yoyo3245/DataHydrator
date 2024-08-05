import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-get-type-by-id',
  templateUrl: './get-type-by-id.component.html',
  styleUrls: ['./get-type-by-id.component.css']
})
export class GetTypeByIdComponent {
  displayedColumns: string[] = ['id', 'location_code', 'name', 'description', 'inventory_location', 'location_type', 'parent_id'];
  dataSource = new MatTableDataSource([]);
  resultsLength = 0;
  isNewestFirst = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  errorMessage = "";
  id = "";
  table = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  // ngOnInit() {
  //   this.loadData();
  // }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.onPageChange(event);
    });
  }

  loadData() {
    const url = `http://localhost:5290/api/locations/types/${this.id}/items?page=${this.currentPage}&pageLength=${this.pageSize}&isNewestFirst=${this.isNewestFirst}`;
    
    this.http.get<any>(url).subscribe(
      (response) => {
        this.dataSource.data = response.page_data;
        this.resultsLength = response.total_count;
        this.errorMessage = "";
        this.calculatePageInfo();
        this.table = true;
      },
      (error) => { 
        this.errorMessage = "Location Type Not Found"; 
        this.table = false
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
