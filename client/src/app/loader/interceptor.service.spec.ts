import { TestBed } from '@angular/core/testing';

import { InterceptorService } from './interceptor.service';

describe('InterceptorService', () => {
  let service: InterceptorService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
