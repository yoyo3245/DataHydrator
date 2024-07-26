import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToggleThemeComponent } from './toggle-theme.component';

describe('ToggleThemeComponent', () => {
  let component: ToggleThemeComponent;
  let fixture: ComponentFixture<ToggleThemeComponent>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [ToggleThemeComponent],
      imports: [MatSlideToggleModule]
    });
    fixture = TestBed.createComponent(ToggleThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
