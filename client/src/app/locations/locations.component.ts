import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'location_code', 'name', 'description', 'inventory_location', 'location_type', 'parent_id'];
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

  exportData() {
    // Define custom headers
    const customHeaders = [
      'ID', 'Location Code', 'Name', 'Description', 'Inventory Location', 'Location Type', 'Parent ID', 'Created At'
    ];

    // Prepare data to match custom headers
    const mappedData = this.dataSource.data.map((item: any) => ({
      'ID': item.id,
      'Location Code': item.location_code,
      'Name': item.name,
      'Description': item.description,
      'Inventory Location': item.inventory_location,
      'Location Type': item.location_type,
      'Parent ID': item.parent_id,
      'Created At': item.created_at
    }));

    // Create worksheet from mapped data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData, { header: customHeaders });

    // Calculate column widths based on headers and data
    const columnWidths = this.getAutoSizeColumnWidths(mappedData, customHeaders);

    // Apply column widths to worksheet
    ws['!cols'] = columnWidths.map(width => ({ wpx: width }));

    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Locations');

    // Generate buffer and save as file
    const wbout: Blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'locations.xlsx');
  }

  private getAutoSizeColumnWidths(data: any[], headers: string[]): number[] {
    if (data.length === 0) return headers.map(() => 100); // Default width if no data

    const columnWidths: number[] = headers.map(header => header.length); // Start with header lengths

    data.forEach(row => {
      headers.forEach((header, index) => {
        const cellValueLength = row[header] ? row[header].toString().length : 0;
        columnWidths[index] = Math.max(columnWidths[index], cellValueLength);
      });
    });

    return columnWidths.map(length => length * 10); // Adjust width scaling
  }
}
