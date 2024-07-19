import { Component } from '@angular/core';
import { PaginatorIntl } from './paginatorIntl.service';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntl}]
})
export class AppComponent {
  title = 'client';
}
