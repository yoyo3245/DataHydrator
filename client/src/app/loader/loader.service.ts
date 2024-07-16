import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading = new BehaviorSubject<boolean>(false);
  public progress = new BehaviorSubject<number>(0);
  public isHydrator = new BehaviorSubject<boolean>(false); // Initialize with false

  constructor() {}

  setHydrator(isHydrator: boolean) {
    this.isHydrator.next(isHydrator);
  }

  setLoading(isLoading: boolean) {
    this.isLoading.next(isLoading);
  }

  setProgress(progress: number) {
    this.progress.next(progress);
  }
}
