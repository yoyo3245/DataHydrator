import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading = new BehaviorSubject<boolean>(false);
  public progress = new BehaviorSubject<number>(0);

  constructor() { }

  setLoading(isLoading: boolean) {
    this.isLoading.next(isLoading);
  }

  setProgress(progress: number) {
    this.progress.next(progress);
  }
}
