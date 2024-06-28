import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHydratorComponent } from './data-hydrator.component';

describe('DataHydratorComponent', () => {
  let component: DataHydratorComponent;
  let fixture: ComponentFixture<DataHydratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataHydratorComponent]
    });
    fixture = TestBed.createComponent(DataHydratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
