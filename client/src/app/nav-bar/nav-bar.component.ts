import { Component } from '@angular/core';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(public loaderService: LoaderService) {  }

}
