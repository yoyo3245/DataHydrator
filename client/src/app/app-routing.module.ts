import { GetByIdDisplayComponent } from './get-by-id-display/get-by-id-display.component';
import { DeleteByIdDisplayComponent } from './delete-by-id-display/delete-by-id-display.component';
import { CreateLocationDisplayComponent } from './create-location-display/create-location-display.component';
import { UpdateLocationDisplayComponent } from './update-location-display/update-location-display.component';
import { DataHydratorComponent } from './data-hydrator/data-hydrator.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LocationsComponent } from './locations/locations.component';
import { LocationTypesDisplayComponent } from './location-types-display/location-types-display.component';
import { CreateTypeDisplayComponent } from './create-type-display/create-type-display.component';
import { GetTypeByIdComponent } from './get-type-by-id/get-type-by-id.component';
import { DeleteTypeDisplayComponent } from './delete-type-display/delete-type-display.component';
import { UploadDisplayComponent } from './upload-display/upload-display.component';

const routes: Routes = [
  { path: 'locations', component: LocationsComponent }, 
  { path: 'types/delete', component: DeleteTypeDisplayComponent },
  { path: 'locations/delete', component: DeleteByIdDisplayComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'types', component: LocationTypesDisplayComponent },
  { path: 'types/create', component: CreateTypeDisplayComponent },
  { path: 'types/get', component: GetTypeByIdComponent },
  { path: 'locations/get', component: GetByIdDisplayComponent}, 
  { path: 'locations/create', component: CreateLocationDisplayComponent},
  { path: 'locations/update', component: UpdateLocationDisplayComponent},
  { path: 'locations/upload', component: UploadDisplayComponent },
  { path: 'home', component: DataHydratorComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
