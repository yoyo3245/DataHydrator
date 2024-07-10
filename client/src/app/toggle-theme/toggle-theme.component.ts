import { Component, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-toggle-theme',
  template: `
    <mat-slide-toggle [checked]="!isDarkTheme" (change)="toggleTheme($event.checked)">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-circle-half" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16"/>
        </svg>
      </span>
    </mat-slide-toggle>
  `,
  styles: [`
    mat-slide-toggle {
      margin: 16px;
    }
  `]
})
export class ToggleThemeComponent {
  isDarkTheme: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    // Initialize theme from localStorage or default to dark mode
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.applyTheme(); // Apply theme based on initial value from localStorage
  }

  toggleTheme(checked: boolean) {
    this.isDarkTheme = !checked; // Invert checked value for dark mode logic
    this.applyTheme();
    this.saveThemeToStorage();
  }

  private applyTheme() {
    const theme = this.isDarkTheme ? 'dark' : 'light';
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
  }

  private saveThemeToStorage() {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
