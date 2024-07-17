import { GetByIdDisplayComponent } from './get-by-id-display/get-by-id-display.component';
import { DeleteByIdDisplayComponent } from './delete-by-id-display/delete-by-id-display.component';
import { CreateLocationDisplayComponent } from './create-location-display/create-location-display.component';
import { UpdateLocationDisplayComponent } from './update-location-display/update-location-display.component';
import { DataHydratorComponent } from './data-hydrator/data-hydrator.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LocationsComponent } from './locations/locations.component';

const routes: Routes = [
  { path: 'locations', component: LocationsComponent }, 
  { path: 'delete', component: DeleteByIdDisplayComponent},
  { path: '', redirectTo: '/hydrator', pathMatch: 'full' }, 
  { path: 'get', component: GetByIdDisplayComponent}, 
  { path: 'create', component: CreateLocationDisplayComponent},
  { path: 'update', component: UpdateLocationDisplayComponent},
  { path: 'hydrator', component: DataHydratorComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
