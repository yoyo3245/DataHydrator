import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationsComponent } from './locations/locations.component'; 
import { GetByIdDisplayComponent } from './get-by-id-display/get-by-id-display.component';
import { DeleteByIdDisplayComponent } from './delete-by-id-display/delete-by-id-display.component';
import { CreateLocationDisplayComponent } from './create-location-display/create-location-display.component';
import { UpdateLocationDisplayComponent } from './update-location-display/update-location-display.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataHydratorComponent } from './data-hydrator/data-hydrator.component';
import { ToggleThemeComponent } from './toggle-theme/toggle-theme.component';
import { NavBarComponent } from './nav-bar/nav-bar.component'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms'; 
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InterceptorService } from './loader/interceptor.service';
import { LoaderService } from './loader/loader.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { LocationTypesDisplayComponent } from './location-types-display/location-types-display.component';
import { CreateTypeDisplayComponent } from './create-type-display/create-type-display.component';
import { GetTypeByIdComponent } from './get-type-by-id/get-type-by-id.component';
import { DeleteTypeDisplayComponent } from './delete-type-display/delete-type-display.component';
import { UploadDisplayComponent } from './upload-display/upload-display.component';


@NgModule({
  declarations: [
    AppComponent,
    LocationsComponent, 
    GetByIdDisplayComponent,
    DeleteByIdDisplayComponent,
    CreateLocationDisplayComponent,
    UpdateLocationDisplayComponent,
    DataHydratorComponent,
    ToggleThemeComponent,
    NavBarComponent,
    LocationTypesDisplayComponent,
    CreateTypeDisplayComponent,
    GetTypeByIdComponent,
    DeleteTypeDisplayComponent,
    UploadDisplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    MatSlideToggleModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    NgbModule,
    MatSelectModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
