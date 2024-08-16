import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-display',
  templateUrl: './upload-display.component.html',
  styleUrls: ['./upload-display.component.css']
})
export class UploadDisplayComponent {
  data2DArray: (string | number)[][] = []; // This will hold the 2D array of data
  selectedFile: File | null = null; // To store the selected file
  errormessage: string = "";
  successMessage: string = "";
  errorMessage: string = "";

  constructor(private http: HttpClient){}

  // Method to handle file input change
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0]; // Get the uploaded file
    if (this.selectedFile) {
      this.readFile(this.selectedFile); // Call the method to read the file
    }
  }

  // Method to process the data when the button is clicked
  async processData() {
    for (let r = 1; r < this.data2DArray.length; r++) {
        if (this.data2DArray[r].length === 0) {
            continue; // Skip empty rows
        }
        if (this.data2DArray[r].includes("")) {
          this.errorMessage = `Parsing error on row ${r + 1}`;
          this.successMessage = "";
          break;  
        }

        const body = {
            "LocationCode": this.data2DArray[r][0],
            "Name": this.data2DArray[r][1],
            "Description": this.data2DArray[r][2],
            "InventoryLocation": this.data2DArray[r][3],
            "LocationId": this.data2DArray[r][4],
            "ParentId": this.data2DArray[r][5]
        };

        console.log(body);
        
        try {
            const response = await this.http.post<any>('http://localhost:5290/api/locations/', body).toPromise();
            console.log('POST request successful!');
            this.errorMessage = ""; 
        } catch (error) {
            const httpError = error as HttpErrorResponse;
            this.errorMessage = `Parsing error on row ${r + 1}`;
            this.successMessage = "";
            break;  
        }
        this.successMessage = "Locations have been successfully generated";

    }
}

  // Method to read the file based on its type
  readFile(file: File) {
    const fileType = file.type;

    if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // If it's an XLSX file
      this.readXLSXFile(file);
    } else if (fileType === 'text/csv') {
      // If it's a CSV file
      this.readCSVFile(file);
    } else {
      this.errorMessage = 'Unsupported file type';
    }
  }

  // Method to read XLSX files
  readXLSXFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to 2D array
      this.data2DArray = json as (string | number)[][]; // Store the result in the 2D array 
    };
    reader.readAsBinaryString(file); // Read the file as binary string
  }

  // Method to read CSV files
  readCSVFile(file: File) {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        // Use type assertion to convert unknown[] to (string | number)[][]
        this.data2DArray = results.data as (string | number)[][]; // Explicitly assert the type 
      }
    });
  }
}
