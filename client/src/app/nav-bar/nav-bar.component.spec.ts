import { ComponentFixture, TestBed } from '@angular/core/testing'; 
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavBarComponent } from './nav-bar.component'; 
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavBarComponent, ToggleThemeComponent],
      imports: [MatSidenavModule, MatSlideToggleModule]
    });
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
