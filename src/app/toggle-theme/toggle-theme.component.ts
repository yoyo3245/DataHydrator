import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.css']
})

export class ToggleThemeComponent implements OnInit{

  switchTheme = new FormControl(false)
  @HostBinding('class') className = ''
  darkClass = 'theme-dark'
  lightClass = 'theme-light'

  constructor(private overlay: OverlayContainer){}

  ngOnInit(): void {
    this.switchTheme.valueChanges.subscribe((currentMode) => {
      this.className = currentMode? this.darkClass : this.lightClass

      if (currentMode) {
        this.overlay.getContainerElement().classList.add(this.lightClass)
      }
      else {
        this.overlay.getContainerElement().classList.remove(this.lightClass)
      }
    })
  }

//   toggleDarkMode(): void {
//     if (this.isDarkMode) {
//       document.body.classList.add('dark-theme');
//     } else {
//       document.body.classList.remove('dark-theme');
//     }
//   }
}
